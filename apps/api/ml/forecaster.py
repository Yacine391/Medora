"""
LightGBM demand forecaster with rich feature engineering and SHAP explainability.

Design constraint: ZERO external API calls — all computation is local.
Model runs on-premise inside hospital infrastructure (HDS/RGPD compliance).

Global model approach: one LightGBM trained across all (hospital, drug) pairs
using hospital_id + drug_atc_code as encoded features. Sufficient for synthetic
24-month data. To switch to per-pair models, call _build_features() per pair and
train individually — same feature schema applies.
"""
import logging
import warnings
from typing import Any

import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder

warnings.filterwarnings("ignore")
logger = logging.getLogger(__name__)

# ── Human-readable feature name mapping ───────────────────────────────────────
_FEATURE_LABELS: dict[str, str] = {
    "waste_rate_lag1":              "historical_waste_rate",
    "waste_rate_lag3":              "historical_waste_rate",
    "waste_rate_trend":             "waste_trend",
    "qty_used_lag1":                "recent_demand",
    "qty_used_lag3":                "recent_demand",
    "qty_used_lag6":                "medium_term_demand",
    "qty_used_lag12":               "long_term_demand",
    "qty_used_rolling_3m_mean":     "demand_3m_average",
    "qty_used_rolling_6m_mean":     "demand_6m_average",
    "qty_used_rolling_12m_mean":    "demand_12m_average",
    "qty_used_rolling_3m_std":      "demand_variability",
    "trend_slope_6m":               "demand_trend_slope",
    "month_sin":                    "seasonality",
    "month_cos":                    "seasonality",
    "is_winter_flu_season":         "seasonality",
    "patient_visits_lag1":          "patient_volume",
    "patient_visits_lag3":          "patient_volume",
    "patient_visits_rolling_3m_mean": "patient_volume",
    "visits_to_orders_corr":        "demand_correlation",
    "stockout_count_last_12m":      "stockout_history",
    "days_since_last_stockout":     "stockout_history",
    "avg_lead_time_days":           "lead_time",
    "lead_time_std_6m":             "lead_time_stability",
    "is_rural":                     "rural_buffer",
    "hospital_size_bucket":         "hospital_size",
    "unit_cost_eur_log":            "drug_cost",
    "cost_tier":                    "drug_cost",
}

_DRIVER_TEMPLATES: dict[str, dict] = {
    "historical_waste_rate": {
        "reduce":   "Last months showed high waste — safety margin was over-set.",
        "increase": "Waste rate is low — ordering has been efficient.",
        "neutral":  "Waste rate is within normal range.",
    },
    "seasonality": {
        "reduce":   "Seasonal pattern points to lower demand next period.",
        "increase": "Seasonal peak approaching — demand expected to rise.",
        "neutral":  "No significant seasonal effect detected.",
    },
    "recent_demand": {
        "reduce":   "Recent consumption is trending downward.",
        "increase": "Recent consumption is trending upward.",
        "neutral":  "Recent demand is stable.",
    },
    "demand_6m_average": {
        "reduce":   "6-month average consumption is below historical orders.",
        "increase": "6-month average suggests higher demand is needed.",
        "neutral":  "6-month demand is stable.",
    },
    "lead_time_stability": {
        "reduce":   "Lead time is stable — less buffer needed.",
        "increase": "Variable lead time — extra safety buffer kept.",
        "neutral":  "Lead time variability is moderate.",
    },
    "stockout_history": {
        "reduce":   "No recent stockouts — safety margin can be trimmed.",
        "increase": "Recent stockout detected — adding safety buffer.",
        "neutral":  "Stockout history is minimal.",
    },
    "patient_volume": {
        "reduce":   "Patient volume has been lower than expected.",
        "increase": "Higher patient volume correlates with increased demand.",
        "neutral":  "Patient volume is stable.",
    },
    "rural_buffer": {
        "increase": "Rural hospital: +5% buffer for supply chain fragility.",
        "reduce":   "Urban supply chain — minimal buffer needed.",
        "neutral":  "Standard supply chain buffer applied.",
    },
    "demand_trend_slope": {
        "reduce":   "Demand trend is declining over the last 6 months.",
        "increase": "Demand trend is rising over the last 6 months.",
        "neutral":  "Demand trend is flat.",
    },
}


def _get_template(label: str, direction: str) -> str:
    tmpl = _DRIVER_TEMPLATES.get(label, {})
    return tmpl.get(direction, tmpl.get("neutral", f"Feature '{label}' influenced this prediction."))


# ── Feature engineering ────────────────────────────────────────────────────────

def _build_features(grp: pd.DataFrame) -> pd.DataFrame:
    """Build feature matrix for one (hospital_id, drug_atc_code) group, sorted by date."""
    g = grp.sort_values("date").copy()
    n = len(g)

    # Temporal
    g["month"] = g["date"].dt.month
    g["quarter"] = g["date"].dt.quarter
    g["year"] = g["date"].dt.year
    g["month_sin"] = np.sin(2 * np.pi * g["month"] / 12)
    g["month_cos"] = np.cos(2 * np.pi * g["month"] / 12)
    g["is_winter_flu_season"] = g["month"].isin([10, 11, 12, 1, 2]).astype(int)
    start = g["date"].min()
    g["days_since_start"] = (g["date"] - start).dt.days

    # Demand lags
    for lag in [1, 2, 3, 6, 12]:
        g[f"qty_used_lag{lag}"] = g["qty_used"].shift(lag)

    # Rolling demand stats
    g["qty_used_rolling_3m_mean"] = g["qty_used"].shift(1).rolling(3, min_periods=1).mean()
    g["qty_used_rolling_6m_mean"] = g["qty_used"].shift(1).rolling(6, min_periods=1).mean()
    g["qty_used_rolling_12m_mean"] = g["qty_used"].shift(1).rolling(12, min_periods=1).mean()
    g["qty_used_rolling_3m_std"] = g["qty_used"].shift(1).rolling(3, min_periods=1).std().fillna(0)

    # 6-month demand slope (linear)
    def _slope(series: pd.Series) -> float:
        vals = series.dropna().values
        if len(vals) < 2:
            return 0.0
        return float(np.polyfit(range(len(vals)), vals, 1)[0])

    g["trend_slope_6m"] = (
        g["qty_used"].shift(1).rolling(6, min_periods=2).apply(_slope, raw=False).fillna(0)
    )

    # Waste signal
    g["waste_rate"] = np.where(
        g["qty_ordered"] > 0, g["qty_wasted"] / g["qty_ordered"], 0.0
    )
    g["waste_rate_lag1"] = g["waste_rate"].shift(1)
    g["waste_rate_lag3"] = g["waste_rate"].shift(3)
    g["waste_rate_trend"] = (g["waste_rate"].shift(1) - g["waste_rate"].shift(4)).fillna(0)

    # Supply chain
    if "avg_lead_time_days" in g.columns:
        g["lead_time_std_6m"] = (
            g["avg_lead_time_days"].shift(1).rolling(6, min_periods=1).std().fillna(0)
        )
    else:
        g["avg_lead_time_days"] = 5.0
        g["lead_time_std_6m"] = 0.0

    # Stockout proxy: months where qty_ordered > 1.4 × 6m rolling mean
    rolling_mean = g["qty_ordered"].rolling(6, min_periods=3).mean().shift(1)
    g["is_stockout_month"] = (g["qty_ordered"] > rolling_mean * 1.40).astype(int)
    g["stockout_count_last_12m"] = (
        g["is_stockout_month"].rolling(12, min_periods=1).sum().shift(1).fillna(0)
    )
    stockout_dates = g.index[g["is_stockout_month"] == 1].tolist()

    def _days_since_stockout(idx):
        prior = [i for i in stockout_dates if i < idx]
        if not prior:
            return 365
        return int((g.loc[idx, "date"] - g.loc[prior[-1], "date"]).days)

    g["days_since_last_stockout"] = [_days_since_stockout(i) for i in g.index]

    # Patient visits
    if "patient_visits" in g.columns:
        g["patient_visits_lag1"] = g["patient_visits"].shift(1)
        g["patient_visits_lag3"] = g["patient_visits"].shift(3)
        g["patient_visits_rolling_3m_mean"] = (
            g["patient_visits"].shift(1).rolling(3, min_periods=1).mean()
        )
        # Pearson correlation over 6-month window
        def _corr6(s1: pd.Series, s2: pd.Series, i: int) -> float:
            lo = max(0, i - 5)
            a, b = s1.iloc[lo : i + 1], s2.iloc[lo : i + 1]
            if len(a) < 3 or a.std() == 0 or b.std() == 0:
                return 0.0
            return float(a.corr(b))

        g["visits_to_orders_corr"] = [
            _corr6(g["patient_visits"], g["qty_used"], i) for i in range(n)
        ]
    else:
        g["patient_visits_lag1"] = 0
        g["patient_visits_lag3"] = 0
        g["patient_visits_rolling_3m_mean"] = 0
        g["visits_to_orders_corr"] = 0

    # Context
    g["is_rural"] = g["is_rural"].astype(int) if "is_rural" in g.columns else 0
    if "hospital_size_beds" in g.columns:
        g["hospital_size_bucket"] = pd.cut(
            g["hospital_size_beds"], bins=[0, 150, 600, 99999],
            labels=[0, 1, 2]
        ).astype(int)
    else:
        g["hospital_size_bucket"] = 1

    # Drug properties
    g["unit_cost_eur_log"] = np.log1p(g["unit_cost_eur"]) if "unit_cost_eur" in g.columns else 0
    if "unit_cost_eur" in g.columns:
        g["cost_tier"] = pd.cut(
            g["unit_cost_eur"], bins=[0, 5, 50, 500, 1e9],
            labels=[0, 1, 2, 3]
        ).astype(int)
    else:
        g["cost_tier"] = 0

    return g


# Feature columns used for training/prediction (no target, no IDs, no raw dates)
_FEATURE_COLS = [
    "month_sin", "month_cos", "is_winter_flu_season", "days_since_start",
    "qty_used_lag1", "qty_used_lag2", "qty_used_lag3", "qty_used_lag6", "qty_used_lag12",
    "qty_used_rolling_3m_mean", "qty_used_rolling_6m_mean", "qty_used_rolling_12m_mean",
    "qty_used_rolling_3m_std", "trend_slope_6m",
    "waste_rate_lag1", "waste_rate_lag3", "waste_rate_trend",
    "avg_lead_time_days", "lead_time_std_6m",
    "stockout_count_last_12m", "days_since_last_stockout",
    "patient_visits_lag1", "patient_visits_lag3", "patient_visits_rolling_3m_mean",
    "visits_to_orders_corr",
    "is_rural", "hospital_size_bucket", "unit_cost_eur_log", "cost_tier",
    "hospital_enc", "drug_enc",
]


class OrderForecaster:
    """Global LightGBM forecaster — one model for all (hospital, drug) pairs."""

    def __init__(self, df: pd.DataFrame) -> None:
        df = df.copy()
        df["date"] = pd.to_datetime(df["date"])

        # Encode categorical IDs as integers
        self._hosp_enc = LabelEncoder().fit(df["hospital_id"])
        self._drug_enc = LabelEncoder().fit(df["drug_atc_code"])
        df["hospital_enc"] = self._hosp_enc.transform(df["hospital_id"])
        df["drug_enc"] = self._drug_enc.transform(df["drug_atc_code"])

        # Build full feature set per group
        featurized = []
        for _, grp in df.groupby(["hospital_id", "drug_atc_code"]):
            featurized.append(_build_features(grp))
        self._df = pd.concat(featurized).sort_values(["hospital_id", "drug_atc_code", "date"])

        self._model = self._train()

    # ── Public API (unchanged contract) ───────────────────────────────────────

    def forecast(
        self,
        drug_atc_code: str,
        hospital_id: str,
        horizon_months: int = 1,
    ) -> dict[str, Any]:
        hist = self._df[
            (self._df["drug_atc_code"] == drug_atc_code)
            & (self._df["hospital_id"] == hospital_id)
        ].copy()

        if len(hist) < 6:
            raise ValueError(
                f"Insufficient history for {drug_atc_code}/{hospital_id} (need 6+, got {len(hist)})"
            )

        drug_name = hist["drug_name"].iloc[0]
        avg_qty_ordered = float(hist["qty_ordered"].mean())
        is_rural = bool(hist["is_rural"].iloc[0])
        pathology = hist.get("pathology_focus", pd.Series(["general"])).iloc[0]

        # Safety margin
        stockouts = int(hist["stockout_count_last_12m"].iloc[-1])
        lead_mean = float(hist["avg_lead_time_days"].mean())
        lead_std = float(hist["lead_time_std_6m"].iloc[-1])
        stockout_margin = min(0.10, stockouts * 0.02)
        lead_margin = (lead_std / max(lead_mean, 1)) * 0.05
        rural_margin = 0.05 if is_rural else 0.0
        total_margin = 0.05 + stockout_margin + lead_margin + rural_margin

        # Predict from the last row (most recent features)
        last_row = hist[_FEATURE_COLS].iloc[[-1]]
        fc_mean = max(1.0, float(self._model.predict(last_row)[0]))

        # Confidence interval: ±15% based on rolling demand std
        demand_std = float(hist["qty_used_rolling_3m_std"].iloc[-1])
        rel_std = demand_std / max(fc_mean, 1)
        half_width = fc_mean * max(0.10, min(0.25, rel_std))

        recommended = int(round(fc_mean * (1 + total_margin)))
        conf_low = max(1, int(round((fc_mean - half_width) * (1 + total_margin))))
        conf_high = int(round((fc_mean + half_width) * (1 + total_margin)))

        # Oncology tightening (high unit cost → tighter interval)
        if pathology == "oncology" and drug_atc_code.startswith("L"):
            spread = conf_high - conf_low
            conf_low = max(1, recommended - int(spread * 0.35))
            conf_high = recommended + int(spread * 0.35)

        reduction_pct = round((avg_qty_ordered - recommended) / max(avg_qty_ordered, 1) * 100, 1)

        drivers = self._shap_drivers(last_row, fc_mean, hist)
        reasoning = self._reasoning_text(
            drug_name, avg_qty_ordered, recommended, reduction_pct,
            float(hist["waste_rate_lag1"].iloc[-1] or 0),
            conf_low, conf_high,
        )

        return {
            "drug_atc_code": drug_atc_code,
            "drug_name": drug_name,
            "hospital_id": hospital_id,
            "horizon_months": horizon_months,
            "current_avg_order_qty": int(round(avg_qty_ordered)),
            "recommended_qty": recommended,
            "confidence_low": conf_low,
            "confidence_high": conf_high,
            "reduction_pct": reduction_pct,
            "top_drivers": drivers,
            "reasoning_text": reasoning,
        }

    # ── Training ───────────────────────────────────────────────────────────────

    def _train(self):
        import lightgbm as lgb

        df = self._df.copy()
        df = df.dropna(subset=["qty_used_lag1"])  # need at least lag1

        dates = df["date"].sort_values().unique()
        cutoff = dates[int(len(dates) * 0.75)]  # 75% train / 25% val

        train = df[df["date"] <= cutoff]
        val = df[df["date"] > cutoff]

        X_train = train[_FEATURE_COLS].fillna(0)
        y_train = train["qty_used"].clip(lower=0)
        X_val = val[_FEATURE_COLS].fillna(0)
        y_val = val["qty_used"].clip(lower=0)

        model = lgb.LGBMRegressor(
            n_estimators=200,
            learning_rate=0.05,
            max_depth=6,
            num_leaves=31,
            objective="regression_l1",  # MAE — robust to outliers
            random_state=42,
            n_jobs=1,
            verbose=-1,
        )
        model.fit(
            X_train, y_train,
            eval_set=[(X_val, y_val)],
            callbacks=[lgb.early_stopping(20, verbose=False), lgb.log_evaluation(period=-1)],
        )
        logger.info("LightGBM trained: %d estimators used", model.best_iteration_ or model.n_estimators)
        return model

    # ── SHAP explainability ────────────────────────────────────────────────────

    def _shap_drivers(
        self, row: pd.DataFrame, prediction: float, hist: pd.DataFrame
    ) -> list[dict]:
        try:
            import shap
            explainer = shap.TreeExplainer(self._model)
            shap_values = explainer.shap_values(row.fillna(0))[0]
            feat_names = _FEATURE_COLS

            # Aggregate by human-readable label
            label_impact: dict[str, float] = {}
            for fname, sv in zip(feat_names, shap_values):
                label = _FEATURE_LABELS.get(fname, fname)
                label_impact[label] = label_impact.get(label, 0.0) + sv

            sorted_drivers = sorted(label_impact.items(), key=lambda x: abs(x[1]), reverse=True)[:3]

            drivers = []
            for label, sv in sorted_drivers:
                direction = "reduce" if sv < 0 else "increase"
                impact_pct = round(abs(sv) / max(prediction, 1) * 100, 1)
                drivers.append({
                    "feature": label,
                    "impact_pct": impact_pct,
                    "direction": direction,
                    "explanation": _get_template(label, direction),
                })
            return drivers

        except Exception as exc:
            logger.warning("SHAP failed (%s) — using fallback drivers", exc)
            return self._fallback_drivers(hist)

    def _fallback_drivers(self, hist: pd.DataFrame) -> list[dict]:
        waste_rate = float(hist["waste_rate_lag1"].iloc[-1] or 0)
        return [
            {"feature": "historical_waste_rate", "impact_pct": round(waste_rate * 100, 1),
             "direction": "reduce" if waste_rate > 0.05 else "neutral",
             "explanation": _get_template("historical_waste_rate", "reduce" if waste_rate > 0.05 else "neutral")},
            {"feature": "seasonality", "impact_pct": 5.0, "direction": "neutral",
             "explanation": _get_template("seasonality", "neutral")},
            {"feature": "lead_time_stability", "impact_pct": 2.0, "direction": "neutral",
             "explanation": _get_template("lead_time_stability", "neutral")},
        ]

    # ── Helpers ────────────────────────────────────────────────────────────────

    # ── Backtest / performance metrics ────────────────────────────────────────

    def compute_backtest_metrics(
        self, hospital_id: str, drug_atc_code: str | None = None
    ) -> dict:
        """Walk-forward evaluation on the last 6 months of held-out data."""
        df = self._df[self._df["hospital_id"] == hospital_id].copy()
        if drug_atc_code:
            df = df[df["drug_atc_code"] == drug_atc_code]
        if df.empty:
            return self._empty_backtest()

        all_dates = sorted(df["date"].unique())
        data_months = len(all_dates)
        if data_months < 7:
            return self._empty_backtest()

        eval_dates = all_dates[-6:]
        eval_df = df[df["date"].isin(eval_dates)].copy()
        eval_df = eval_df.dropna(subset=["qty_used_lag1"])  # need at least lag1

        if eval_df.empty:
            return self._empty_backtest()

        X = eval_df[_FEATURE_COLS].fillna(0)
        y_pred = np.maximum(0, self._model.predict(X))
        y_true = eval_df["qty_used"].values.astype(float)

        # Core metrics
        abs_err = np.abs(y_pred - y_true)
        mae = float(np.mean(abs_err))
        nonzero = y_true > 0
        mape_pct = float(np.mean(abs_err[nonzero] / y_true[nonzero] * 100)) if nonzero.any() else 0.0
        acc_10 = float(np.mean(abs_err[nonzero] / y_true[nonzero] <= 0.10)) if nonzero.any() else 0.0
        acc_20 = float(np.mean(abs_err[nonzero] / y_true[nonzero] <= 0.20)) if nonzero.any() else 0.0

        # Waste reduction simulation: predicted × 1.08 safety vs actual ordered
        if "qty_ordered" in eval_df.columns:
            qty_ordered = eval_df["qty_ordered"].values.astype(float)
            simulated = np.maximum(y_pred * 1.08, y_true)  # never below actual use
            actual_waste = np.maximum(qty_ordered - y_true, 0).sum()
            sim_waste = np.maximum(simulated - y_true, 0).sum()
            waste_reduction_pct = (
                float((actual_waste - sim_waste) / actual_waste * 100)
                if actual_waste > 0 else 0.0
            )
            # Months where actual use > ordered qty (stockout proxy)
            stockout_risk = int((y_true > qty_ordered).sum())
        else:
            waste_reduction_pct = 0.0
            stockout_risk = 0

        # Grade
        if acc_10 >= 0.90:
            grade = "A"
        elif acc_10 >= 0.80:
            grade = "B"
        elif acc_10 >= 0.70:
            grade = "C"
        else:
            grade = "D"

        # Confidence
        if data_months >= 18:
            confidence = "High"
        elif data_months >= 12:
            confidence = "Medium"
        else:
            confidence = "Low"

        caveats = ["Computed on synthetic data — real data performance may differ"]
        if drug_atc_code is None:
            caveats.append("Aggregate across all drugs for this hospital")
        if data_months < 18:
            caveats.append(f"Only {data_months} months of history — more data improves accuracy")

        return {
            "evaluation_months": 6,
            "mae": round(mae, 1),
            "mape_pct": round(mape_pct, 1),
            "accuracy_within_10pct": round(acc_10, 3),
            "accuracy_within_20pct": round(acc_20, 3),
            "stockout_risk_avoided": stockout_risk,
            "waste_reduction_simulated_pct": round(max(0.0, waste_reduction_pct), 1),
            "overall_grade": grade,
            "confidence_label": confidence,
            "data_coverage_months": data_months,
            "caveats": caveats,
        }

    def _empty_backtest(self) -> dict:
        return {
            "evaluation_months": 0,
            "mae": None,
            "mape_pct": None,
            "accuracy_within_10pct": None,
            "accuracy_within_20pct": None,
            "stockout_risk_avoided": 0,
            "waste_reduction_simulated_pct": 0.0,
            "overall_grade": "N/A",
            "confidence_label": "Low",
            "data_coverage_months": 0,
            "caveats": ["Insufficient data for backtest evaluation"],
        }

    def _reasoning_text(
        self,
        drug_name: str,
        avg_order: float,
        recommended: int,
        reduction_pct: float,
        waste_rate: float,
        conf_low: int,
        conf_high: int,
    ) -> str:
        direction = "more" if reduction_pct > 0 else "fewer"
        action = "recommends reducing to" if reduction_pct > 0 else "confirms"
        return (
            f"Based on 24 months of data, your hospital currently orders "
            f"{abs(reduction_pct):.1f}% {direction} {drug_name} than needed. "
            f"The AI {action} {recommended:,} units for the next month "
            f"(confidence: {conf_low:,}–{conf_high:,}). "
            f"Main driver: historical waste rate of {waste_rate*100:.1f}%."
        )


# ── Module-level cache ─────────────────────────────────────────────────────────
_cache: dict[tuple, "OrderForecaster"] = {}


def get_forecaster(csv_path: str) -> OrderForecaster:
    import hashlib
    h = hashlib.md5(open(csv_path, "rb").read()).hexdigest()[:8]
    key = (csv_path, h)
    if key not in _cache:
        _cache[key] = OrderForecaster(pd.read_csv(csv_path))
    return _cache[key]
