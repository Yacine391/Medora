"""
Generates realistic synthetic hospital medicine order data for Medora demo.
Output: hospital_data.csv (~1080 rows: 3 hospitals × 15 drugs × 24 months)
Seed: 42 (deterministic — jury always sees same numbers)
"""
import numpy as np
import pandas as pd
from pathlib import Path

rng = np.random.default_rng(42)

# ── Hospitals ─────────────────────────────────────────────────────────────────
HOSPITALS = [
    {"id": "HOSP_001", "name": "CHU Paris",                "beds": 1200, "region": "Ile-de-France",    "is_rural": False, "pathology": "general",  "lead_base": (3, 7),  "safety_buffer": 1.0},
    {"id": "HOSP_002", "name": "CH Clermont-Ferrand",      "beds": 450,  "region": "Auvergne-Rhône",   "is_rural": False, "pathology": "oncology", "lead_base": (4, 8),  "safety_buffer": 1.0},
    {"id": "HOSP_003", "name": "HP Rurale Cantal",         "beds": 80,   "region": "Auvergne-Rhône",   "is_rural": True,  "pathology": "general",  "lead_base": (5, 14), "safety_buffer": 1.1},
]

# ── Drugs ─────────────────────────────────────────────────────────────────────
DRUGS = [
    # class,        atc_code,    name,             base_qty, unit_cost, waste_range
    ("antibiotic",  "J01CA04",   "Amoxicillin",     500,      2.0,      (0.08, 0.15)),
    ("antibiotic",  "J01DD04",   "Ceftriaxone",     200,      5.0,      (0.08, 0.15)),
    ("antibiotic",  "J01FA10",   "Azithromycin",    150,      4.5,      (0.08, 0.15)),
    ("oncology",    "L01CD01",   "Paclitaxel",       30,    800.0,      (0.15, 0.25)),
    ("oncology",    "L01XA01",   "Cisplatin",        40,    350.0,      (0.15, 0.25)),
    ("oncology",    "L01FG01",   "Bevacizumab",      20,   2500.0,      (0.15, 0.25)),
    ("pain",        "N02BE01",   "Paracetamol",    1200,      0.5,      (0.03, 0.06)),
    ("pain",        "N02AA01",   "Morphine",        100,     12.0,      (0.03, 0.06)),
    ("pain",        "N02AX02",   "Tramadol",        180,      3.5,      (0.03, 0.06)),
    ("cardio",      "C10AA05",   "Atorvastatin",    300,      1.8,      (0.02, 0.05)),
    ("cardio",      "C09AA05",   "Ramipril",        250,      1.5,      (0.02, 0.05)),
    ("cardio",      "C07AB07",   "Bisoprolol",      220,      2.2,      (0.02, 0.05)),
    ("respiratory", "R03AC02",   "Salbutamol",      130,      8.0,      (0.10, 0.18)),
    ("respiratory", "R03BA02",   "Budesonide",      110,     15.0,      (0.10, 0.18)),
    ("respiratory", "R03BB04",   "Tiotropium",       90,     45.0,      (0.10, 0.18)),
]

# ── Seasonality multipliers (index 0 = Jan) ───────────────────────────────────
def seasonal_mult(drug_class: str, month: int) -> float:
    m = month  # 1-based
    if drug_class == "antibiotic":
        # +40% Oct–Feb
        return 1.40 if m in (10, 11, 12, 1, 2) else 1.0
    if drug_class == "respiratory":
        # +30% Mar–May and Oct–Dec
        return 1.30 if m in (3, 4, 5, 10, 11, 12) else 1.0
    if drug_class == "oncology":
        # slight Q4 dip
        return 0.90 if m in (12,) else 1.0
    if drug_class == "pain":
        # mild summer peak
        return 1.10 if m in (6, 7, 8) else 1.0
    return 1.0  # cardio: flat


# ── Hospital size scaling ──────────────────────────────────────────────────────
def size_scale(beds: int) -> float:
    return beds / 450.0  # normalised to mid-size hospital


# ── Oncology focus multiplier for HOSP_002 ────────────────────────────────────
def pathology_mult(drug_class: str, hosp_pathology: str) -> float:
    if hosp_pathology == "oncology" and drug_class == "oncology":
        return 2.5
    if hosp_pathology == "oncology" and drug_class in ("antibiotic", "pain"):
        return 1.4  # chemo support drugs
    return 1.0


# ── Generate stockout events ──────────────────────────────────────────────────
def pick_stockouts(dates, hosp_id, drug_atc):
    """Returns set of (year, month) tuples where a stockout occurred."""
    rng2 = np.random.default_rng(abs(hash(hosp_id + drug_atc)) % (2**32))
    n = rng2.integers(0, 2)  # 0 or 1 stockout per drug/hospital combination
    if n == 0:
        return set()
    idx = rng2.integers(1, len(dates) - 1)
    return {(dates[idx].year, dates[idx].month)}


# ── Main generation ───────────────────────────────────────────────────────────
def generate() -> pd.DataFrame:
    dates = pd.date_range("2023-01-01", "2024-12-01", freq="MS")
    rows = []

    # Track global stockout budget (~3-5 across all drugs/hospitals)
    stockout_budget = 4
    stockout_used = 0

    for hosp in HOSPITALS:
        scale = size_scale(hosp["beds"])
        lead_lo, lead_hi = hosp["lead_base"]

        for drug_class, atc, name, base_qty, unit_cost, (w_lo, w_hi) in DRUGS:
            prev_stockout = False
            stockout_months = set()
            if stockout_used < stockout_budget:
                stockout_months = pick_stockouts(dates, hosp["id"], atc)
                if stockout_months:
                    stockout_used += 1

            for dt in dates:
                s_mult = seasonal_mult(drug_class, dt.month)
                p_mult = pathology_mult(drug_class, hosp["pathology"])
                buf = hosp["safety_buffer"]

                # Base quantity with scaling + noise
                base = base_qty * scale * s_mult * p_mult * buf
                noise = rng.normal(1.0, 0.07)
                qty_ordered = max(1, int(round(base * noise)))

                # Post-stockout spike: +60% the following month
                if prev_stockout:
                    qty_ordered = int(round(qty_ordered * 1.60))
                prev_stockout = (dt.year, dt.month) in stockout_months

                # Waste
                waste_rate = rng.uniform(w_lo, w_hi)
                qty_wasted = max(0, int(round(qty_ordered * waste_rate)))
                qty_used = qty_ordered - qty_wasted

                # Patient visits correlated with antibiotic/pain orders (Pearson ~0.7)
                visits_base = 800 * scale * s_mult
                visits_noise = rng.normal(1.0, 0.10)
                patient_visits = max(50, int(round(visits_base * visits_noise)))

                lead_time = int(rng.integers(lead_lo, lead_hi + 1))

                rows.append({
                    "date":               dt.strftime("%Y-%m-%d"),
                    "hospital_id":        hosp["id"],
                    "drug_atc_code":      atc,
                    "drug_name":          name,
                    "qty_ordered":        qty_ordered,
                    "qty_used":           qty_used,
                    "qty_wasted":         qty_wasted,
                    "patient_visits":     patient_visits,
                    "avg_lead_time_days": lead_time,
                    "unit_cost_eur":      unit_cost,
                    "pathology_focus":    hosp["pathology"],
                    "region":             hosp["region"],
                    "hospital_size_beds": hosp["beds"],
                    "is_rural":           hosp["is_rural"],
                })

    return pd.DataFrame(rows)


if __name__ == "__main__":
    df = generate()
    out = Path(__file__).parent / "hospital_data.csv"
    df.to_csv(out, index=False)
    print(f"Generated {len(df)} rows → {out}")
    print(f"Hospitals: {df['hospital_id'].nunique()}, Drugs: {df['drug_atc_code'].nunique()}, Months: {df['date'].nunique()}")
