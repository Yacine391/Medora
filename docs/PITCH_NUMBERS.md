# Medora — Pitch Numbers (sourced)

Every number we use publicly, with its source.

---

## Problem size

| Metric | Value | Source |
|---|---|---|
| Medicines thrown away in France | **7,675 tons** in 2024 | Cyclamed — Rapport annuel 2024 |
| Cost of hospital medicine waste | **€1.7 billion/year** | Cour des comptes — Rapport médicaments, sept. 2025 |
| CO₂e from wasted medicines | **~1 million tons CO₂e** | Derived: 7,675t × 65 kg CO₂e/kg API × 2 (transport+incin) |
| Healthcare share of France's CO₂ footprint | **8%** | Shift Project — Décarbonons la Santé 2023 |
| Medicines share of healthcare emissions | **40%** | Shift Project 2023 |
| Average over-order rate (hospital wards) | **15–25%** | Internal estimates, consistent with Cour des comptes |

---

## Impact per hospital (Medora demo outputs)

| Hospital type | Beds | Est. annual waste | Medora savings (est.) |
|---|---|---|---|
| CHU Paris (urban, large) | 1,200 | ~€180k/year | ~€32k/year, ~4.5t CO₂e |
| CH Clermont-Ferrand (medium, oncology) | 450 | ~€67k/year | ~€12k/year, ~1.7t CO₂e |
| HP Cantal (rural, small) | 80 | ~€12k/year | ~€2.2k/year, ~300 kg CO₂e |

*Derived from synthetic dataset (seed=42). Production numbers require per-hospital calibration.*

---

## Market (TAM / SAM / SOM)

| | Value | Basis |
|---|---|---|
| **TAM** — EU hospital medicine procurement | ~€80 billion | EMA market data 2023 |
| **SAM** — 15% addressable waste × EU | ~€12 billion | 15% waste rate × TAM |
| **SAM France** | ~€1.7 billion | Cour des comptes 2025 (direct) |
| **SOM — 5-year France** | ~€12 million | 0.7% of SAM France, 50 paying hospitals × €240k ARR |
| **SOM — 10-year EU** | ~€120 million | 1% of SAM EU |

---

## Carbon methodology

| Constant | Value | Source |
|---|---|---|
| CO₂e per kg active pharmaceutical ingredient (API) | **65 kg CO₂e/kg** | Shift Project 2025 |
| Average drug weight per unit | **50 g** | Internal estimate (tablet/vial average) |
| Average transport distance (Asia → France) | **10,000 km** | Shift Project 2025 |
| Transport CO₂ factor | **0.04 kg CO₂e per tonne·km** | ADEME Base Empreinte 2024 |
| Incineration CO₂ factor | **2.5 kg CO₂e per kg waste** | ADEME Base Empreinte 2024 |

### CO₂ calculation per avoided unit

```
manufacturing_kg = qty_avoided × weight_g/1000 × 65
transport_kg     = qty_avoided × weight_g/1000 × 10000 × 0.04 / 1000
incineration_kg  = qty_avoided × weight_g/1000 × 2.5
co2_total_kg     = manufacturing_kg + transport_kg + incineration_kg
```

---

## Ecotoxicity scores (by ATC prefix)

| ATC | Drug class | Score /100 | Source |
|---|---|---|---|
| L01 | Antineoplastics | 90 | UNEP 2019, OECD 2019 |
| J01 | Antibiotics | 75 | UNEP 2019 |
| N02 | Analgesics | 30 | OECD 2019 |
| C09 | ACE inhibitors | 25 | OECD 2019 |
| A02 | Antacids | 10 | OECD 2019 |

---

## Regulatory context (Why now)

- **CSRD 2026** — large French hospitals must report Scope 3 emissions; medicine procurement is the largest source
- **NHS Net Zero 2040** — UK equivalent driving EU attention
- **HDS certification** — all hospital IT in France must be HDS-certified; Medora ships HDS-ready by design
- **MDR** — we are NOT a medical device (optimising procurement, not treatment); confirmation pending legal review
