import base64
import io
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ml.forecaster import OrderForecaster, get_forecaster
from ml.impact_calculator import ImpactCalculator

app = FastAPI(title="Medora API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).parent / "data" / "hospital_data.csv"
_impact = ImpactCalculator()


# ── Request models ─────────────────────────────────────────────────────────────

class ForecastRequest(BaseModel):
    hospital_id: str
    drug_atc_code: str
    horizon_months: int = 1
    csv_data: str | None = None


class BatchForecastRequest(BaseModel):
    hospital_id: str
    horizon_months: int = 1
    csv_data: str | None = None


class ImpactRequest(BaseModel):
    drug_atc_code: str
    current_order_qty: int
    optimal_order_qty: int
    unit_cost_eur: float


class ImpactBatchRequest(BaseModel):
    items: list[ImpactRequest]


class ForecastAndImpactRequest(BaseModel):
    hospital_id: str
    horizon_months: int = 1
    csv_data: str | None = None


# ── Helpers ────────────────────────────────────────────────────────────────────

def _get_forecaster(csv_data: str | None) -> OrderForecaster:
    if csv_data is None:
        return get_forecaster(str(DATA_PATH))
    try:
        raw = base64.b64decode(csv_data).decode("utf-8")
    except Exception:
        raw = csv_data
    return OrderForecaster(pd.read_csv(io.StringIO(raw)))


def _unit_cost(df: pd.DataFrame, atc: str, hosp: str) -> float:
    row = df[(df["drug_atc_code"] == atc) & (df["hospital_id"] == hosp)]
    if row.empty or "unit_cost_eur" not in row.columns:
        return 1.0
    return float(row["unit_cost_eur"].iloc[0])


# ── Base routes ────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok", "project": "Medora"}


@app.get("/api/sample-data")
def sample_data():
    csv_bytes = DATA_PATH.read_bytes()
    return StreamingResponse(
        iter([csv_bytes]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=hospital_data.csv"},
    )


@app.get("/api/drugs")
def drugs():
    df = pd.read_csv(DATA_PATH)
    return (
        df[["drug_atc_code", "drug_name"]]
        .drop_duplicates()
        .sort_values("drug_name")
        .to_dict(orient="records")
    )


# ── Forecast routes ────────────────────────────────────────────────────────────

@app.post("/api/forecast")
def forecast(req: ForecastRequest):
    fc = _get_forecaster(req.csv_data)
    df = fc._df
    if req.hospital_id not in df["hospital_id"].values:
        raise HTTPException(422, f"hospital_id '{req.hospital_id}' not found")
    if req.drug_atc_code not in df["drug_atc_code"].values:
        raise HTTPException(422, f"drug_atc_code '{req.drug_atc_code}' not found")
    try:
        return fc.forecast(req.drug_atc_code, req.hospital_id, req.horizon_months)
    except ValueError as e:
        raise HTTPException(422, str(e))


@app.post("/api/forecast-batch")
def forecast_batch(req: BatchForecastRequest):
    fc = _get_forecaster(req.csv_data)
    df = fc._df
    if req.hospital_id not in df["hospital_id"].values:
        raise HTTPException(422, f"hospital_id '{req.hospital_id}' not found")

    drug_codes = df[df["hospital_id"] == req.hospital_id]["drug_atc_code"].unique().tolist()
    results = []
    for atc in drug_codes:
        try:
            results.append(fc.forecast(atc, req.hospital_id, req.horizon_months))
        except ValueError as e:
            results.append({"drug_atc_code": atc, "error": str(e)})
    return {"hospital_id": req.hospital_id, "forecasts": results}


# ── Impact routes ──────────────────────────────────────────────────────────────

@app.post("/api/impact")
def impact(req: ImpactRequest):
    qty_avoided = req.current_order_qty - req.optimal_order_qty
    return _impact.calculate(req.drug_atc_code, qty_avoided, req.unit_cost_eur)


@app.post("/api/impact-batch")
def impact_batch(req: ImpactBatchRequest):
    per_drug = []
    totals = {
        "qty_avoided": 0,
        "co2_total_kg": 0.0,
        "euros_saved": 0.0,
        "ecotox_score_total": 0.0,
    }

    for item in req.items:
        qty_avoided = item.current_order_qty - item.optimal_order_qty
        result = _impact.calculate(item.drug_atc_code, qty_avoided, item.unit_cost_eur)
        result["drug_atc_code"] = item.drug_atc_code
        per_drug.append(result)
        totals["qty_avoided"] += result["qty_avoided"]
        totals["co2_total_kg"] += result["co2_total_kg"]
        totals["euros_saved"] += result["euros_saved"]
        totals["ecotox_score_total"] += result["ecotox_score"]

    totals["co2_total_kg"] = round(totals["co2_total_kg"], 2)
    totals["euros_saved"] = round(totals["euros_saved"], 2)
    totals["ecotox_score_total"] = round(totals["ecotox_score_total"], 1)
    return {"totals": totals, "by_drug": per_drug}


# ── Combined forecast + impact ─────────────────────────────────────────────────

@app.post("/api/forecast-and-impact")
def forecast_and_impact(req: ForecastAndImpactRequest):
    fc = _get_forecaster(req.csv_data)
    df = fc._df

    if req.hospital_id not in df["hospital_id"].values:
        raise HTTPException(422, f"hospital_id '{req.hospital_id}' not found")

    drug_codes = df[df["hospital_id"] == req.hospital_id]["drug_atc_code"].unique().tolist()

    by_drug = []
    totals = {
        "qty_avoided": 0,
        "co2_total_kg": 0.0,
        "euros_saved": 0.0,
        "ecotox_score_total": 0.0,
    }

    for atc in drug_codes:
        try:
            fcast = fc.forecast(atc, req.hospital_id, req.horizon_months)
        except ValueError:
            continue

        qty_avoided = fcast["current_avg_order_qty"] - fcast["recommended_qty"]
        unit_cost = _unit_cost(df, atc, req.hospital_id)
        imp = _impact.calculate(atc, max(0, qty_avoided), unit_cost)

        merged = {**fcast, "impact": imp}
        by_drug.append(merged)

        if qty_avoided > 0:
            totals["qty_avoided"] += imp["qty_avoided"]
            totals["co2_total_kg"] += imp["co2_total_kg"]
            totals["euros_saved"] += imp["euros_saved"]
            totals["ecotox_score_total"] += imp["ecotox_score"]

    totals["co2_total_kg"] = round(totals["co2_total_kg"], 2)
    totals["euros_saved"] = round(totals["euros_saved"], 2)
    totals["ecotox_score_total"] = round(totals["ecotox_score_total"], 1)

    return {
        "hospital_id": req.hospital_id,
        "horizon_months": req.horizon_months,
        "totals": totals,
        "by_drug": by_drug,
    }
