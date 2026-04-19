"""
Hybrid demand forecaster: Prophet time-series + waste-rate adjustment + explainability.
Fallback to weighted moving average if Prophet fails.
"""
import logging
import warnings
from functools import lru_cache
from typing import Any

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")
logger = logging.getLogger(__name__)


class OrderForecaster:
    def __init__(self, df: pd.DataFrame) -> None:
        df = df.copy()
        df["date"] = pd.to_datetime(df["date"])
        self._df = df

    # ── Public API ─────────────────────────────────────────────────────────────

    def forecast(
        self,
        drug_atc_code: str,
        hospital_id: str,
        horizon_months: int = 1,
    ) -> dict[str, Any]:
        hist = self._filter(drug_atc_code, hospital_id)
        if len(hist) < 6:
            raise ValueError(
                f"Insufficient history for {drug_atc_code} / {hospital_id} "
                f"(need 6+ months, got {len(hist)})"
            )

        drug_name = hist["drug_name"].iloc[0]
        is_rural = bool(hist["is_rural"].iloc[0])
        pathology = hist["pathology_focus"].iloc[0] if "pathology_focus" in hist.columns else "general"

        # ── Feature extraction ─────────────────────────────────────────────
        avg_qty_ordered = float(hist["qty_ordered"].mean())
        waste_rate_recent = self._waste_rate(hist)
        stockout_safety = self._stockout_buffer(hist)
        lead_mean, lead_std = self._lead_stats(hist)
        rural_buffer = 0.05 if is_rural else 0.0

        # ── Demand forecast ────────────────────────────────────────────────
        try:
            fc_mean, fc_low, fc_high, trend_direction = self._prophet_forecast(hist, horizon_months)
        except Exception as exc:
            logger.warning("Prophet failed (%s) — using moving average fallback", exc)
            fc_mean, fc_low, fc_high, trend_direction = self._ma_fallback(hist, horizon_months)

        # ── Safety margin = stockout buffer + lead-time buffer + rural bonus ──
        lead_buffer = min(0.10, (lead_std / max(lead_mean, 1)) * 0.15)
        safety_margin = stockout_safety + lead_buffer + rural_buffer

        # ── Optimal quantity: forecast + safety on top ─────────────────────
        recommended = int(round(fc_mean * (1 + safety_margin)))
        conf_low = int(round(fc_low * (1 + safety_margin)))
        conf_high = int(round(fc_high * (1 + safety_margin)))

        # Oncology: tighten confidence (high unit value → tighter forecast)
        if pathology == "oncology" and drug_atc_code.startswith("L"):
            spread = conf_high - conf_low
            conf_low = int(round(recommended - spread * 0.35))
            conf_high = int(round(recommended + spread * 0.35))

        reduction_pct = round((avg_qty_ordered - recommended) / avg_qty_ordered * 100, 1)

        # ── Explainability ─────────────────────────────────────────────────
        drivers = self._build_drivers(
            waste_rate_recent, stockout_safety, lead_std, lead_mean,
            trend_direction, is_rural, pathology, avg_qty_ordered, recommended
        )

        reasoning = self._reasoning_text(
            drug_name, avg_qty_ordered, recommended, reduction_pct,
            waste_rate_recent, conf_low, conf_high
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

    # ── Internal helpers ───────────────────────────────────────────────────────

    def _filter(self, atc: str, hosp: str) -> pd.DataFrame:
        mask = (self._df["drug_atc_code"] == atc) & (self._df["hospital_id"] == hosp)
        return self._df[mask].sort_values("date").reset_index(drop=True)

    def _waste_rate(self, hist: pd.DataFrame) -> float:
        recent = hist.tail(6)
        total_ordered = recent["qty_ordered"].sum()
        if total_ordered == 0:
            return 0.0
        # Weight recent 3 months 2×
        w = hist.tail(6).copy()
        w["weight"] = [1, 1, 1, 2, 2, 2][:len(w)]
        wasted = (w["qty_wasted"] * w["weight"]).sum()
        ordered = (w["qty_ordered"] * w["weight"]).sum()
        return float(wasted / ordered) if ordered > 0 else 0.0

    def _stockout_buffer(self, hist: pd.DataFrame) -> float:
        recent = hist.tail(12)
        # A stockout signature: month where qty_ordered was >40% above 6-month rolling mean
        rolling_mean = hist["qty_ordered"].rolling(6, min_periods=3).mean()
        spikes = (hist["qty_ordered"] > rolling_mean * 1.40).tail(12).sum()
        if spikes >= 2:
            return 0.08
        if spikes == 1:
            return 0.04
        return 0.02  # base safety margin

    def _lead_stats(self, hist: pd.DataFrame) -> tuple[float, float]:
        col = "avg_lead_time_days"
        if col not in hist.columns:
            return 5.0, 1.0
        return float(hist[col].mean()), float(hist[col].std(ddof=0))

    def _prophet_forecast(
        self, hist: pd.DataFrame, horizon: int
    ) -> tuple[float, float, float, str]:
        from prophet import Prophet

        # Prophet requires ds + y columns
        ts = hist[["date", "qty_used"]].rename(columns={"date": "ds", "qty_used": "y"})
        ts = ts[ts["y"] >= 0]

        m = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            seasonality_mode="multiplicative",
            interval_width=0.80,
            changepoint_prior_scale=0.05,
        )

        # Add patient_visits as external regressor if available
        if "patient_visits" in hist.columns:
            ts["visits"] = hist["patient_visits"].values[: len(ts)]
            m.add_regressor("visits")
            future_visits = float(hist["patient_visits"].tail(3).mean())

        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            m.fit(ts)

        future = m.make_future_dataframe(periods=horizon, freq="MS")
        if "patient_visits" in hist.columns:
            future["visits"] = future_visits

        forecast = m.predict(future)
        last = forecast.tail(horizon)

        yhat = max(0.0, float(last["yhat"].mean()))
        yhat_low = max(0.0, float(last["yhat_lower"].mean()))
        yhat_high = max(0.0, float(last["yhat_upper"].mean()))

        # Trend direction from Prophet trend component
        trend_vals = forecast["trend"].values
        trend_direction = "up" if trend_vals[-1] > trend_vals[-7] else "down"

        return yhat, yhat_low, yhat_high, trend_direction

    def _ma_fallback(
        self, hist: pd.DataFrame, horizon: int
    ) -> tuple[float, float, float, str]:
        """Weighted moving average fallback (last 6 months, recent weighted 2×)."""
        vals = hist["qty_used"].tail(6).values.astype(float)
        weights = np.array([1, 1, 1, 2, 2, 2][: len(vals)], dtype=float)
        yhat = float(np.average(vals, weights=weights[-len(vals) :]))
        std = float(np.std(vals))
        trend_direction = "up" if vals[-1] > vals[0] else "down"
        return yhat, max(0.0, yhat - std), yhat + std, trend_direction

    def _build_drivers(
        self,
        waste_rate: float,
        stockout_buffer: float,
        lead_std: float,
        lead_mean: float,
        trend: str,
        is_rural: bool,
        pathology: str,
        avg_order: float,
        recommended: float,
    ) -> list[dict]:
        drivers: list[dict] = []

        # Driver 1: waste rate (always present)
        waste_impact = round(waste_rate * 100, 1)
        if waste_rate > 0.05:
            drivers.append({
                "feature": "historical_waste_rate",
                "impact_pct": waste_impact,
                "direction": "reduce",
                "explanation": f"Last 6 months showed {waste_impact}% waste — safety margin was too high.",
            })
        else:
            drivers.append({
                "feature": "historical_waste_rate",
                "impact_pct": waste_impact,
                "direction": "neutral",
                "explanation": f"Waste rate is low ({waste_impact}%) — ordering is already efficient.",
            })

        # Driver 2: seasonality / trend
        if trend == "down":
            drivers.append({
                "feature": "seasonality",
                "impact_pct": round(abs(avg_order - recommended) / max(avg_order, 1) * 40, 1),
                "direction": "reduce",
                "explanation": "Demand trend is decreasing — next month needs fewer units.",
            })
        else:
            drivers.append({
                "feature": "seasonality",
                "impact_pct": round(abs(avg_order - recommended) / max(avg_order, 1) * 20, 1),
                "direction": "increase",
                "explanation": "Seasonal pattern suggests higher demand next period.",
            })

        # Driver 3: lead time stability or rural/pathology
        if is_rural:
            drivers.append({
                "feature": "rural_buffer",
                "impact_pct": 5.0,
                "direction": "increase",
                "explanation": "Rural hospital: +5% safety buffer for longer, variable supply chains.",
            })
        elif lead_std < 1.5:
            drivers.append({
                "feature": "lead_time_stability",
                "impact_pct": round(min(5.0, lead_std), 1),
                "direction": "reduce",
                "explanation": f"Lead time is stable (mean {lead_mean:.0f}d, std {lead_std:.1f}d) — less buffer needed.",
            })
        else:
            drivers.append({
                "feature": "lead_time_variance",
                "impact_pct": round(min(8.0, lead_std), 1),
                "direction": "increase",
                "explanation": f"Variable lead time (std {lead_std:.1f}d) — keeping extra safety buffer.",
            })

        return drivers[:3]

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
        action = "recommends reducing" if reduction_pct > 0 else "confirms"
        return (
            f"Based on 24 months of data, your hospital currently orders "
            f"{abs(reduction_pct):.1f}% {direction} {drug_name} than needed. "
            f"The AI {action} {recommended:,} units for the next month "
            f"(confidence interval: {conf_low:,}–{conf_high:,}). "
            f"Main driver: historical waste rate of {waste_rate*100:.1f}% indicates "
            f"{'over-ordering.' if reduction_pct > 0 else 'ordering is on track.'}"
        )


# ── Module-level cache keyed on (hospital_id, file_hash) ──────────────────────
@lru_cache(maxsize=32)
def _cached_df(csv_path: str, file_hash: int) -> pd.DataFrame:
    return pd.read_csv(csv_path)


def get_forecaster(csv_path: str) -> "OrderForecaster":
    import hashlib
    content_hash = int(
        hashlib.md5(open(csv_path, "rb").read()).hexdigest(), 16
    ) % (10**9)
    df = _cached_df(csv_path, content_hash)
    return OrderForecaster(df)
