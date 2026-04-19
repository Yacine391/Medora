# Medora — Architecture & Technical Contract

## 0. COMPLIANCE & DEPLOYMENT CONSTRAINTS

- **DEPLOYMENT MODEL:** on-premise or private cloud only (HDS-certified hosting: OVH, Scaleway, AWS Santé)
- **DATA RESIDENCY:** all hospital order history, waste data, patient visits stay inside the hospital's infrastructure
- **NO EXTERNAL API CALLS for predictions:** the ML model runs 100% locally (LightGBM + SHAP, no cloud LLM calls)
- **REGULATORY ALIGNMENT:**
  - RGPD (GDPR) — Article 9 (health data), Article 32 (security)
  - HDS (Hébergement de Données de Santé, France) — required for any hospital deployment
  - MDR qualification — pending legal review (likely NOT a medical device since we optimize procurement, not patient treatment)
- **MODEL ARTIFACTS:** can be shipped pre-trained OR re-trained locally per hospital
- **TELEMETRY:** opt-in anonymized aggregate metrics only (e.g. "X tons CO2 saved across all clients") — never raw data

## 1. IMPACT DIMENSIONS
| Axis | What we measure |
|---|---|
| Energy → CO2 | Manufacturing energy of wasted units → kg CO2e |
| Transport → CO2 | km from factory to hospital × wasted units |
| Waste → pollution | Ecotoxicity on biodiversity + human health + incineration CO2 |
| Overcost → € | Direct euros lost from over-ordering |

## 2. KEY CHIFFRES (hardcoded in calculations — do not invent others)
- France medicine waste 2024: **7 675 tons** (Cyclamed)
- Cost: **€561M – €1.7B/year** (Cour des comptes 2025)
- Carbon per kg API average: **65 kg CO2e** (Shift Project 2025)
- France healthcare = **8%** of national carbon footprint
- Medicine = **40%** of healthcare emissions in France
- Average transport: **10 000 km** for API from Asia (Shift Project)

## 3. FORECASTING MODEL SPEC

**Engine:** LightGBM (global model) + SHAP explainability. Zero external API calls.
See `apps/api/ml/forecaster.py` for implementation.

### Input features (engineered from raw CSV)
**Temporal:** month_sin/cos, is_winter_flu_season, days_since_start
**Demand dynamics:** qty_used lag1/2/3/6/12, rolling 3m/6m/12m mean, 3m std, trend_slope_6m
**Waste signal:** waste_rate lag1/lag3, waste_rate_trend
**Supply chain:** avg_lead_time_days, lead_time_std_6m, stockout_count_last_12m, days_since_last_stockout
**Context:** patient_visits lag1/lag3, rolling 3m mean, visits-to-orders correlation, is_rural, hospital_size_bucket
**Drug properties:** atc_class encoded, unit_cost_eur_log, cost_tier

### Output
```
{
  recommended_qty: int,
  confidence_low: int,
  confidence_high: int,
  top_drivers: [{feature, impact_pct, direction, explanation}] × 3,
  reasoning_text: string
}
```

## 4. DATA CONTRACT

### CSV upload format
**Required columns:**
```
date, drug_atc_code, drug_name, qty_ordered, qty_used, qty_wasted,
patient_visits, avg_lead_time_days, unit_cost_eur
```

**Optional columns:**
```
pathology_focus, region, hospital_size_beds, is_rural (bool)
```

## 5. API ENDPOINTS

```
POST /api/forecast
  Body:  { csv_data | hospital_id, target_drug, horizon_months }
  Returns: { recommended_qty, confidence_low, confidence_high,
             top_drivers[], reasoning_text }

POST /api/impact
  Body:  { current_order_qty, optimal_order_qty, drug_atc_code }
  Returns: { co2_saved_kg, euros_saved, ecotox_score,
             transport_km_saved, incineration_avoided_kg }

GET  /api/sample-data
  Returns: demo CSV for jury
```

## 6. DATASET SOURCES (fetch in P3)
| Source | Content |
|---|---|
| ANSM / ATC classification | Drug codes |
| ADEME Base Empreinte | Energy + transport emission factors |
| Shift Project — Décarbonons la Santé | Medicine LCA data |
| Cyclamed annual report | Waste statistics |
| DREES / ATIH | Hospital activity data France |
| OpenMedic (Assurance Maladie) | Open prescription data |
| EMA EPAR | European drug data |

> If real datasets not accessible: generate synthetic but REALISTIC data based on published statistics above.

## 7. TOKEN ECONOMY RULES (every future prompt)
- NEVER re-explain the project in code comments — reference road_map.md
- Prefer small, focused files over monoliths
- Use shadcn/ui components — do not rewrite buttons/cards from scratch
- Re-use existing utility functions — check `lib/` before creating new helpers
- When stuck, ask user a question rather than generating 3 wrong versions
