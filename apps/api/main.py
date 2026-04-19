from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd

app = FastAPI(title="Medora API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).parent / "data" / "hospital_data.csv"


@app.get("/api/health")
def health():
    return {"status": "ok", "project": "Medora"}


@app.get("/api/sample-data")
def sample_data():
    """Return hospital_data.csv as downloadable CSV."""
    csv_bytes = DATA_PATH.read_bytes()
    return StreamingResponse(
        iter([csv_bytes]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=hospital_data.csv"},
    )


@app.get("/api/drugs")
def drugs():
    """Return unique drugs with ATC codes from hospital_data.csv."""
    df = pd.read_csv(DATA_PATH)
    result = (
        df[["drug_atc_code", "drug_name"]]
        .drop_duplicates()
        .sort_values("drug_name")
        .to_dict(orient="records")
    )
    return result
