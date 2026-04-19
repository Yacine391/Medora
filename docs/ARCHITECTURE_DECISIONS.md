# Medora — Architecture Decisions

Five key trade-offs, with reasoning.

---

## 1. LightGBM instead of Prophet (or GPT)

**Decision:** Use LightGBM (gradient boosting) with SHAP for the forecasting engine.

**Why not Prophet?**
- Prophet is designed for univariate time series; we have 30+ cross-drug features that matter (waste rate, stockout history, lead time variance, patient visits)
- Prophet's `make_future_dataframe` doesn't accept external regressors cleanly at inference time
- LightGBM trains 10× faster on our feature matrix and achieves lower RMSE in cross-validation

**Why not a cloud LLM?**
- HDS compliance prohibits sending hospital data to external APIs
- LLMs are non-deterministic; pharmacists need reproducible, auditable recommendations
- Cost: cloud LLM calls at scale (15 drugs × 3 hospitals per run) would be expensive

**Trade-off accepted:** LightGBM needs 24+ months of training data per drug. Hospitals with <12 months history would need a cold-start fallback (planned for v2).

---

## 2. On-prem instead of SaaS cloud

**Decision:** Medora runs inside the hospital's infrastructure (or HDS-certified private cloud). No patient data ever leaves.

**Why not a multi-tenant SaaS?**
- French law requires HDS certification for any system processing health data (even procurement-adjacent data that includes patient visit counts)
- Hospital IT departments (DSIH) will not approve an external SaaS that touches procurement data without 12+ months of security review
- RGPD Article 9 applies to any dataset correlated with patient health, including aggregated visit counts

**Trade-off accepted:** On-prem deployments are slower to sell and harder to update. Mitigation: ship as a Docker container with automatic model retraining on a schedule.

---

## 3. Synthetic data for the MVP

**Decision:** Train and demo on a fully synthetic 1,080-row dataset (3 hospitals × 15 drugs × 24 months, seed=42).

**Why not real hospital data?**
- Real French hospital procurement data requires a formal DPA (Data Processing Agreement) + IRB-equivalent approval
- Typical cycle: 6–12 months of legal + IT security reviews
- We built the pipeline in 72 hours

**Why is synthetic data sufficient for a hackathon demo?**
- We derived all parameters (seasonality amplitude, waste rates, lead time distributions) from published statistics (Cyclamed, Cour des comptes, Shift Project)
- The model architecture and pipeline are identical to what production would use — only the training data changes
- All ML tests pass on the synthetic data, including a no-external-API-call AST scan

**Trade-off accepted:** Model accuracy numbers (e.g. "18% reduction") are illustrative. Real production would require per-hospital calibration on 36+ months of actual data.

---

## 4. French market first

**Decision:** Product, copy, compliance, and pricing are designed for France first.

**Why France?**
- France has the clearest regulatory pain point: the Cour des comptes 2025 report named €1.7B in hospital medicine waste as a priority target — creating political will for procurement reform
- CSRD 2026 forces large French hospitals to report Scope 3 emissions; medicine procurement is their biggest lever
- HDS certification is a hard requirement unique to France — solving it creates a moat against US/UK competitors entering the market
- The Cyclamed pipeline gives us a credible waste measurement methodology that doesn't exist in other markets

**Trade-off accepted:** French hospital sales cycles are 18–36 months. Germany, Netherlands, and the NHS are faster-moving markets for follow-on expansion.

---

## 5. Target pharmacy-logistics, not clinicians

**Decision:** The product is sold to and used by hospital pharmacists and logistics heads, not doctors or nurses.

**Why not target clinical prescriptions?**
- Optimising *which* medicine to prescribe is a medical device (MDR Class IIa or IIb) — CE marking takes 2–4 years
- Optimising *how much to order* is a procurement tool — no MDR qualification likely needed

**Why pharmacy-logistics?**
- Hospital pharmacists already own the procurement decision; they have the data (order history, waste logs) and the budget authority
- The KPI they are measured on (% expired stock, procurement cost per bed) maps directly to what Medora optimises
- Logistics heads face the CSRD reporting burden — Medora's CO₂ output becomes their sustainability KPI

**Trade-off accepted:** Pharmacy teams are smaller than clinical teams. Total addressable contacts per hospital = 2–5 people. Requires direct outreach, not bottom-up PLG.
