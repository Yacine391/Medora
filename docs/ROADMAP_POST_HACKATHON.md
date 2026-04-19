# Medora — Post-Hackathon Roadmap

## Months 1–6: Validate with one real hospital

**Goal:** Prove the model works on real data and pharmacists will use it.

| Action | Owner | Notes |
|---|---|---|
| Sign 1 design-partner CHU (Paris or Lyon) | CEO/BD | Unpaid; they get free tool + report |
| Real data ingestion pipeline (CSV + ERP connectors) | Engineering | Target: Pharma·gest, PharmaGO, HealthPRO |
| Model recalibration on 36 months real data | ML | Compare synthetic vs real accuracy |
| MDR legal review (is this a medical device?) | Legal counsel | Likely Class I or exempt — but need written opinion |
| HDS certification scoping with OVH or Scaleway | CTO | Estimate: 3–6 months, €20k–50k |
| First CSRD-compatible CO₂ report export (PDF) | Engineering | Differentiator for procurement heads |

**Milestone:** Design partner says "we would pay for this." First accuracy benchmarks on real data.

---

## Months 7–12: 3 pilot hospitals, revenue

**Goal:** €30–90k ARR from 3 paying pilots. Enough data to fundraise.

| Action | Owner | Notes |
|---|---|---|
| Pilot 2: rural hospital (Cantal-type, 80–120 beds) | BD | Proves rural model works; lower contract risk |
| Pilot 3: oncology-focused CH | BD | High-value drugs (L01 = highest ecotox score) |
| ERP integration v1 (read-only) | Engineering | Pull data automatically; reduce pharmacist effort |
| CSRD Scope 3 export certified by third party | Legal | Needed for large hospital group procurement |
| Series Seed preparation (deck, data room, KPIs) | CEO | Target: €1–3M, 12-month runway |
| Expand drug coverage to 50+ ATC codes | ML | Current: 15 synthetic drugs |

**Milestone:** 3 signed contracts at €10–30k/year each. Revenue covers team salary for 6 months.

---

## Months 13–24: Scale to 10–20 customers, EU expansion

**Goal:** Demonstrate repeatable sales motion. Enter Germany or Netherlands.

| Action | Owner | Notes |
|---|---|---|
| Self-service onboarding (CSV → results in <30 min) | Engineering | Removes dependency on CS for every deploy |
| Hospital group contracts (GHT: 5–15 hospitals) | BD | GHT Île-de-France = 12 hospitals in one deal |
| Germany pilot (no HDS equivalent = faster) | BD | Target: Charité or regional KH in Baden-Württemberg |
| Series Seed close + team hire (2 engineers, 1 sales) | CEO | |
| Predictive stockout alerts (real-time dashboard) | Engineering | v2 feature: shift from reactive to proactive |
| API integrations: Pharmagest, SAP IS-H | Engineering | Required for large hospital groups |

**Milestone:** €500k–1M ARR. 10–20 paying hospitals. Expansion into 1 additional EU country.

---

## KPIs we track

| KPI | Month 6 target | Month 12 target | Month 24 target |
|---|---|---|---|
| Design partners | 1 | 3 | 10–20 |
| Paying customers | 0 | 3 | 15 |
| ARR | €0 | €60–90k | €750k–1M |
| Avg reduction in waste (real data) | — | 12–18% | 15–22% |
| CO₂e avoided (total, all clients) | — | ~5t | ~50t |
| Team size | 3 | 5 | 10 |
