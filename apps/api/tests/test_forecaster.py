import sys
from pathlib import Path

import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from ml.forecaster import OrderForecaster

DATA_PATH = Path(__file__).parent.parent / "data" / "hospital_data.csv"


@pytest.fixture(scope="module")
def forecaster():
    df = pd.read_csv(DATA_PATH)
    return OrderForecaster(df)


def test_forecast_returns_valid_dict(forecaster):
    result = forecaster.forecast("J01CA04", "HOSP_001", horizon_months=1)

    assert result["drug_atc_code"] == "J01CA04"
    assert result["drug_name"] == "Amoxicillin"
    assert result["recommended_qty"] > 0
    assert isinstance(result["recommended_qty"], int)
    assert result["confidence_low"] <= result["recommended_qty"] <= result["confidence_high"]
    assert isinstance(result["reasoning_text"], str) and len(result["reasoning_text"]) > 20


def test_reduction_pct_realistic(forecaster):
    result = forecaster.forecast("J01CA04", "HOSP_001", horizon_months=1)
    assert 5 <= result["reduction_pct"] <= 35, (
        f"reduction_pct {result['reduction_pct']} out of realistic 5–35% range"
    )


def test_top_drivers_has_three_entries(forecaster):
    result = forecaster.forecast("J01CA04", "HOSP_001", horizon_months=1)
    assert len(result["top_drivers"]) == 3
    for d in result["top_drivers"]:
        assert "feature" in d
        assert "impact_pct" in d
        assert "direction" in d
        assert "explanation" in d
        assert d["impact_pct"] >= 0


def test_no_external_api_call():
    """Enforce data-residency contract: no HTTP client imports in forecaster module."""
    import ast
    forecaster_path = Path(__file__).parent.parent / "ml" / "forecaster.py"
    tree = ast.parse(forecaster_path.read_text())

    forbidden = {"requests", "httpx", "openai", "anthropic", "google", "urllib3", "aiohttp"}
    found = set()

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name.split(".")[0] in forbidden:
                    found.add(alias.name)
        elif isinstance(node, ast.ImportFrom):
            if node.module and node.module.split(".")[0] in forbidden:
                found.add(node.module)

    assert not found, f"Forbidden HTTP client imports found in forecaster.py: {found}"
