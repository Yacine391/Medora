import base64
import io
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ml.forecaster import OrderForecaster, get_forecaster

app = FastAPI(title="Medora API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).parent / "data" / "hospital_data.csv"


# ── Request models ─────────────────────────────────────────────────────────────

class ForecastRequest(BaseModel):
    hospital_id: str
    drug_atc_code: str
    horizon_months: int = 1
    csv_data: str | None = None  # raw CSV string or base64-encoded


class BatchForecastRequest(BaseModel):
    hospital_id: str
    horizon_months: int = 1
    csv_data: str | None = None


# ── Helpers ────────────────────────────────────────────────────────────────────

def _load_df(csv_data: str | None) -> tuple[pd.DataFrame, str | None]:
    """Return (df, csv_path_or_None). Uses default CSV when csv_data is None."""
    if csv_data is None:
        return get_forecaster(str(DATA_PATH))._df, str(DATA_PATH)

    # Try base64 first, fall back to raw string
    try:
        raw = base64.b64decode(csv_data).decode("utf-8")
    except Exception:
        raw = csv_data

    df = pd.read_csv(io.StringIO(raw))
    return df, None


def _get_forecaster(csv_data: str | None) -> OrderForecaster:
    if csv_data is None:
        return get_forecaster(str(DATA_PATH))
    df, _ = _load_df(csv_data)
    return OrderForecaster(df)


# ── Routes ─────────────────────────────────────────────────────────────────────

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
    result = (
        df[["drug_atc_code", "drug_name"]]
        .drop_duplicates()
        .sort_values("drug_name")
        .to_dict(orient="records")
    )
    return result


@app.post("/api/forecast")
def forecast(req: ForecastRequest):
    fc = _get_forecaster(req.csv_data)
    df = fc._df

    # Validate inputs
    if req.hospital_id not in df["hospital_id"].values:
        raise HTTPException(status_code=422, detail=f"hospital_id '{req.hospital_id}' not found in dataset")
    if req.drug_atc_code not in df["drug_atc_code"].values:
        raise HTTPException(status_code=422, detail=f"drug_atc_code '{req.drug_atc_code}' not found in dataset")

    try:
        result = fc.forecast(req.drug_atc_code, req.hospital_id, req.horizon_months)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return result


@app.post("/api/forecast-batch")
def forecast_batch(req: BatchForecastRequest):
    fc = _get_forecaster(req.csv_data)
    df = fc._df

    if req.hospital_id not in df["hospital_id"].values:
        raise HTTPException(status_code=422, detail=f"hospital_id '{req.hospital_id}' not found")

    drug_codes = df[df["hospital_id"] == req.hospital_id]["drug_atc_code"].unique().tolist()

    results = []
    for atc in drug_codes:
        try:
            results.append(fc.forecast(atc, req.hospital_id, req.horizon_months))
        except ValueError as e:
            results.append({"drug_atc_code": atc, "error": str(e)})

    return {"hospital_id": req.hospital_id, "forecasts": results}
