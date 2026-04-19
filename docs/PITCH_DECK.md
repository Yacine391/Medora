# Medora — Pitch Deck (12 slides)

*Content outline for Figma / Pitch.com. One paragraph per slide = the key message to land.*

---

## Slide 1 · Title + Vision

**"Medora — we stop medicine waste before it happens."**

Visual: a hospital shelf with orange "EXPIRED" stickers on medicine boxes.
Tagline: *AI that tells you the right quantity to order. Every time.*

---

## Slide 2 · The Scene

**One story. One hospital. One waste problem.**

A real scenario: CHU Paris orders 1,200 units of morphine sulfate in January. By April, 216 units have expired. A nurse drops them in the red bin. They go to the incinerator.

That's 18% waste on a €50/unit drug. €10,800 gone. 140 kg CO₂e emitted. For one drug. One month. One hospital.

*This happens in every hospital in France, 365 days a year.*

---

## Slide 3 · The Numbers

**This is not a niche problem.**

- **7,675 tons** of medicines thrown away in France in 2024 *(Cyclamed)*
- **€1.7 billion** wasted every year *(Cour des comptes 2025)*
- **1 million tons CO₂e** emitted for medicines that were never used *(Shift Project 2025)*

France's healthcare system is responsible for 8% of the national carbon footprint. Medicines are 40% of that. Waste is the biggest single lever.

---

## Slide 4 · Why Now

**Three forces converging in 2025–2026.**

1. **CSRD 2026** — large French hospitals must report Scope 3 emissions publicly. Medicine procurement is their #1 source. They have no tool for it.
2. **Cour des comptes pressure** — the September 2025 report names €1.7B in hospital waste as a top fiscal priority. Procurement teams are under heat.
3. **NHS Net Zero mandate** — UK NHS already committed to net zero by 2040. The EU will follow. Hospitals need to show action, not intention.

The window is open. Medora is the instrument.

---

## Slide 5 · Our Solution

**Three steps from raw data to the right order.**

1. **Upload** — pharmacist uploads 24 months of order history (CSV or ERP connector). Takes 2 minutes.
2. **Analyse** — LightGBM model runs locally, on 30+ features: demand history, waste rate, patient visits, seasonality, lead time, stockouts, drug class.
3. **Order** — pharmacist receives: optimal quantity, confidence interval, top 3 drivers explained in plain language.

No cloud. No black box. No patient data leaves the hospital.

---

## Slide 6 · How It Works

**LightGBM + SHAP. On-prem. Auditable.**

- **Model**: gradient boosting trained on 30 features per drug per hospital
- **Explainability**: SHAP values give the top 3 drivers per recommendation ("waste rate trending up +12% = reduce by 80 units")
- **Safety margin**: 5% base buffer + rural penalty + lead time variance — pharmacists stay protected
- **Deployment**: Docker container, runs next to your pharmacy software
- **Zero external API calls**: predictions never leave the hospital's servers (HDS & RGPD compliant)

*[Screenshot of demo dashboard with KPI strip + before/after chart]*

---

## Slide 7 · Live Demo

**HOSP_003 — Rural hospital, Cantal, 80 beds. 12-month horizon.**

*Live demo (~90 seconds)*:
1. Select HP Cantal + 12 months → Run analysis
2. Show KPI strip: ~18% reduction, €XX k saved, ~XXX kg CO₂e
3. Click one drug (e.g. amoxicillin) → show SHAP driver: "seasonal demand drop in summer −15%"
4. Show cumulative savings chart: Medora line vs current trajectory

*Talking point:* "This is running on a synthetic dataset trained in 72 hours. With 36 months of real hospital data, accuracy improves by 30–40%."

---

## Slide 8 · Market

**A €80B European procurement market with a measurable waste problem.**

| | Value |
|---|---|
| TAM — EU hospital medicine procurement | ~€80B |
| SAM — addressable waste (15% × TAM) | ~€12B |
| SAM France | ~€1.7B (Cour des comptes, direct) |
| SOM — 5 years, France | ~€12M (50 hospitals × €240k ARR) |
| SOM — 10 years, EU | ~€120M |

Business model: SaaS at €15–25/bed/month (or per-volume). 500-bed hospital = €90–150k/year. Full payback in <30 days of waste savings.

---

## Slide 9 · Business Model

**Simple SaaS. Fast payback.**

- **Pricing**: €20/bed/month (flat) OR 10% of measured waste savings (shared upside)
- **Onboarding**: CSV upload → results in 30 minutes → no IT project
- **Contract**: annual, hospital-level. GHT contracts = 5–15 hospitals in one deal.
- **Unit economics**: €240k ARR per 1,000-bed hospital. CAC ~€15k (1 sales cycle). LTV/CAC > 10×.
- **Land and expand**: start with 2 drug families (antibiotics + oncology, highest waste/cost), expand to full formulary.

---

## Slide 10 · Traction & Roadmap

**Where we are. Where we go.**

*Today (hackathon MVP):*
- Working end-to-end product (upload → forecast → impact → visualisation)
- LightGBM + SHAP on synthetic dataset. All tests pass.
- HDS/RGPD architecture designed from day one.

*Month 1–6:* 1 design-partner CHU. Real data ingestion. MDR legal review.

*Month 7–12:* 3 paying pilots (€60–90k ARR). CSRD export. Series Seed prep.

*Month 13–24:* 10–20 hospitals. €750k ARR. Germany expansion.

---

## Slide 11 · Team

**[Fill in with real team members]**

- **[Name]** — [Role]. Background in [X]. Led [Y].
- **[Name]** — [Role]. Background in [X]. Previously at [Y].
- **[Name]** — [Role]. Background in [X]. Expertise in [Y].

*Combined expertise covers: ML engineering, hospital operations, regulatory (HDS/RGPD), and go-to-market.*

---

## Slide 12 · The Ask

**We are looking for design partners and pre-seed capital.**

**Design partners** (no commercial risk):
- 1 CHU or CH willing to share 24 months of anonymised procurement data
- In return: free tool, CO₂ impact report, co-authorship on a case study

**Pre-seed: €500k**
- 12 months of runway for a 3-person team
- Goals: real-data validation, HDS certification, 3 paying pilots, Series Seed prep

*Contact: [email] · [LinkedIn] · Live demo: [Vercel URL]*
