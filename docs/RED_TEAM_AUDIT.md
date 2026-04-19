# Medora — Adversarial Red Team Audit

Three hostile personas. 30 brutal questions. No flattery.

Use this document to prepare for the hardest questions at the jury and in investor meetings. For each weakness rated 1–2, there is a concrete fix you can do before you present.

---

## PERSONA 1 — SKEPTICAL VC

*"I've seen 300 decks this year. Your problem is real. Your solution is unproven. Here's why I'm passing."*

---

### VC-1. You have zero traction. Not one real hospital has touched this product.

You're asking for €500k on synthetic data, a 72-hour MVP, and a government report. Every healthtech founder who walks in here cites the same Cour des comptes number. Show me a signed letter of intent from one pharmacist director — not a friend, not a professor — and we can talk.

**Current answer strength: 1/5**

This is the hardest objection and the FAQ answer ("we get to the first meeting through conferences and networks") is weak. It describes a plan, not reality.

**How to improve before jury:** Stop being defensive. Own it directly: *"We have zero traction. That's why we're asking for design partner capital, not revenue capital. Our first ask after this room is a phone call to [specific CHU name and contact title]. Here is that contact's name."* Having one named target contact — even unconfirmed — changes the signal from "we have no plan" to "we have one concrete next step." Get one.

---

### VC-2. €1.7B is a headline number. Your addressable revenue is 1,000 times smaller.

SAM ≠ revenue. Even if every French hospital adopted Medora, you collect 1–2% of the waste value as SaaS fees. Your real SAM is €17–34M France. Your SOM in 5 years is €12M. That's a small business, not a venture-scale outcome.

**Current answer strength: 2/5**

The PITCH_NUMBERS.md acknowledges this math honestly, but the pitch deck leads with €1.7B without immediately clarifying the revenue capture. Juries and VCs will do this math live and think you're hiding it.

**How to improve before jury:** Add one sentence to the market slide: *"We capture 1–2% of waste savings as SaaS revenue. That's a €17–34M France revenue ceiling — we reach venture scale at the EU level (€120M SOM in 10 years) or via adjacent products: CSRD reporting, carbon credits, ERP connectors."* Naming the ceiling honestly is stronger than hoping they won't notice.

---

### VC-3. Your synthetic data accuracy claim is not a claim — it's a simulation of a simulation.

"15–22% waste reduction vs baseline" is computed by your model on data your model was also trained to fit. It tells us nothing about real-world performance. Any overfit model looks good on synthetic data. You have no hold-out from a real hospital, so your accuracy numbers are marketing, not science.

**Current answer strength: 2/5**

FAQ Q10 is honest ("we don't know yet") but it doesn't give the jury a reason to believe the model will work. The answer lands as "trust us."

**How to improve before jury:** Acknowledge the limitation first, then pivot to methodology: *"You're right. Our synthetic accuracy is illustrative, not predictive. Here's what matters: the feature engineering is grounded in published waste distributions, not invented. The same model class — gradient boosting on tabular procurement data — achieves 12–18% waste reduction in peer-reviewed supply chain studies [cite one specific paper]. Our architecture is validated; our numbers are estimates."* Find and cite one real academic paper on ML-based hospital inventory optimisation before jury day.

---

### VC-4. The sales cycle is 18 months. You have 3 people. You'll run out of money before you close a paying contract.

At €15k CAC and 12–18 month cycles, your €500k pre-seed gives you 10 months of runway for a team of 3. You will not close a single paying hospital contract before you need to raise again. This is a bridge to nowhere.

**Current answer strength: 2/5**

The FAQ answer explains the design partner strategy but doesn't address the bridge problem — that the Series Seed depends on a paid contract that won't exist yet.

**How to improve before jury:** Reframe the pre-seed goal explicitly: *"The €500k does not need to close a paying contract. It needs to produce one validated case study with a named CHU: real data, published accuracy numbers, signed testimonial. That is the Series Seed raise story. The design partner timeline is 6 months, not 18."* Also add the sub-€40k direct contract path to the roadmap — rural hospitals at €12k/year bypass the procurement tender entirely.

---

### VC-5. Why you? What makes this team uniquely qualified to sell into French hospital procurement?

You're presenting at a hackathon. Where is your clinical co-founder? Your former hospital pharmacist? Your DSIH relationship? Building a Next.js dashboard is not a moat. The moat in this market is the first hospital relationship, and you don't have one.

**Current answer strength: 1/5**

This is the team slide's fatal flaw. The PITCH_DECK.md slide 11 is entirely placeholder text: "[Name] — [Role]." At a hackathon that's expected, but the jury will still ask this.

**How to improve before jury:** Fill in the team slide with real names and honest positioning. Even if the team is students with no hospital experience, lead with why that specific combination of skills is relevant: ML engineering for the forecasting, regulatory research for HDS, and one person with any healthcare adjacent experience (internship, family member in the industry, research paper on healthcare systems). Then immediately commit to a clinical advisor: *"We are in conversation with [Dr. X / Pr. Y] for a clinical advisory role. We will confirm this in 30 days."*

---

### VC-6. On-prem deployment is a support nightmare. How do you update the model when you find a bug?

Every on-prem deployment is a different server, a different Python version, a different firewall. When your model has a critical bug — and it will — how do you push a fix to 50 hospitals? You'll need a support team the size of your revenue. This is not a SaaS business; it's a managed services business in disguise.

**Current answer strength: 2/5**

The FAQ doesn't address the operational complexity of on-prem deployments at scale. The architecture notes "ships as a Docker container" but says nothing about update management.

**How to improve before jury:** Add one sentence to the architecture slide: *"Model updates ship as a new Docker image via our registry. The hospital's IT team runs one command: `docker pull medora/api:latest && docker restart medora-api`. No manual intervention, no data leaves the hospital during update."* This shows you've thought through the operational reality. Also acknowledge the hybrid option: a private cloud deployment on OVH HDS-certified infrastructure is on-prem for compliance purposes and SaaS for operations — this is the real path at scale.

---

### VC-7. What stops Pharmagest or Dedalus from building this feature in 6 months?

They already have 100% of French hospital pharmacy data. They have the ERP integration. They have the sales relationships. They have the compliance certification. You are a feature, not a company.

**Current answer strength: 3/5**

The FAQ Q22 addresses this with three moat layers, but doesn't acknowledge the single most dangerous competitor: the ERP incumbents themselves adding a forecasting module.

**How to improve before jury:** Address this scenario head-on: *"If Pharmagest builds this, we win by being acquired. That's a reasonable outcome. More likely: Pharmagest is a logistics software company. Building a reliable ML forecasting module with SHAP explainability and CSRD reporting output is a 12–18 month engineering project for them. They will partner with or acquire a specialist rather than build it. We want to be that specialist."* Positioning acquisition as an outcome rather than a threat is stronger.

---

### VC-8. Your CO₂ methodology gives you a nice number but it's not audited. CSRD auditors won't accept it.

You derived 1Mt CO₂e from Shift Project constants and Cyclamed volumes. Those constants are not verified for your specific drug mix, your specific hospitals, or your specific transport routes. A CSRD auditor will want a methodology certified by a third party. You have a formula, not a certification.

**Current answer strength: 2/5**

The FAQ Q25 says the numbers are "sourced from ADEME Base Empreinte 2024 and Shift Project 2025, both accepted reference databases under French CSRD guidance" — but this conflates using accepted data sources with having an audited methodology. They are not the same thing.

**How to improve before jury:** Be precise about what's validated and what isn't: *"Our CO₂ factors are from ADEME and Shift Project, which are accepted references. Our methodology applies them to hospital procurement data in a way that a CSRD auditor can verify — every constant, every formula is documented and reproducible. What we do not yet have is a third-party attestation. That's a €5–10k engagement with a firm like Bureau Veritas or EcoVadis, planned for month 6."* Name the specific third-party firms. It shows you know the space.

---

### VC-9. Your market slide says €80B TAM but that's total procurement, not total waste. The real TAM for your product is the value you capture from waste reduction — which is €12M in France.

TAM/SAM/SOM is supposed to represent your realistic revenue ceiling, not the industry size. €80B is the procurement market; your product does not capture a fraction of €80B. It captures a SaaS fee on top of waste savings. Presenting €80B as TAM is either confused or intentionally misleading.

**Current answer strength: 1/5**

This is a real flaw in the market slide framing. €80B TAM for a SaaS tool that charges €20/bed/month is analytically incorrect and experienced VCs will flag it immediately.

**How to improve before jury:** Reframe the slide with clean math:
- TAM: 2.5 million hospital beds in Europe × €20/bed/month × 12 = **€600M ARR** (pure SaaS ceiling)
- SAM France: 400,000 hospital beds × €20 × 12 = **€96M ARR**
- SOM Year 5: 5,000 beds under contract = **€12M ARR**

This is smaller but honest. Investors respect honesty over inflated TAM. The adjacent revenue streams (CSRD attestation, carbon credits, ERP connectors) can grow the ceiling further.

---

### VC-10. You claim ROI in under 3 months. Prove it with a number that isn't from your own model.

Your ROI calculation is circular: Medora says it saves €32k, therefore Medora has positive ROI. You need an independent reference — a case study from a comparable supply chain AI deployment in healthcare, or a number from the Cour des comptes on per-hospital waste that supports your per-bed savings estimate.

**Current answer strength: 2/5**

The FAQ uses the model's own output as the ROI proof. No external validation exists.

**How to improve before jury:** Find one external reference. The Cour des comptes report or the Cyclamed methodology should contain per-hospital waste estimates by size category. If not, find a published academic study on demand forecasting in hospital pharmacy (there are several in the European Journal of Hospital Pharmacy). Quote their measured waste reduction rates. Even a 10% reduction in a peer study is stronger than a 22% reduction from your own model.

---

## PERSONA 2 — HOSPITAL CIO / DSIH

*"My pharmacy runs on three systems that took 5 years to integrate. I've seen 15 AI startups this year. I'm not buying."*

---

### CIO-1. My pharmacy runs on Pharmagest. Show me the API contract, the field mapping, and the auth method. "CSV upload" is not an integration.

I cannot ask my pharmacist to manually export a CSV every month and upload it to your tool. That's a workaround, not a solution. Real integration means I can automate the data transfer. Show me the technical spec or this conversation is over.

**Current answer strength: 2/5**

The FAQ mentions Pharmagest as a target and says their API is "open and documented," but doesn't give the actual integration spec. A CIO will hear "open API" and immediately know you've never actually read the Pharmagest documentation.

**How to improve before jury:** Either find and read the actual Pharmagest developer documentation before jury day, or be precisely honest: *"We have reviewed Pharmagest's partner program documentation. Their API exposes procurement history via REST with OAuth2. Field mapping for our 9 required columns is confirmed possible. We have not yet built the connector — that is 6 weeks of engineering in month 3 of the pilot. For the design partner phase, the CSV export from Pharmagest takes 5 minutes and we walk the pharmacist through it once."* Naming the auth method (OAuth2) signals you've actually looked at it.

---

### CIO-2. If your recommendation causes a stockout during a flu season surge and ICU patients don't get their medication, who signs the letter?

I need a contractual answer, not a philosophical one. Which clause in your Terms of Service protects my hospital if your tool contributes to a patient harm event?

**Current answer strength: 2/5**

The FAQ answer is legally reasonable (pharmacist retains liability as with any decision support tool) but doesn't address the CIO's real concern: the Terms of Service and the indemnification clause. No ToS exists yet.

**How to improve before jury:** Add one slide or talking point: *"Our Terms of Service (draft available) follow the clinical decision support software standard: we are a recommendation system, not an autonomous agent. The pharmacist approves every order. Our liability is limited to the software licence fee. The DPA we sign with every hospital explicitly excludes liability for pharmacist decisions made after reviewing our output. This is the same indemnification structure as Gleamer, Sonio, and every French clinical AI company."* Name French clinical AI companies that have solved the same legal structure.

---

### CIO-3. I already have 40 software vendors. Your tool costs €120k/year for a 1,000-bed hospital. That's the same as two full-time pharmacist assistants who don't break when the server goes down.

The hidden cost of a new vendor is not the licence fee. It's the security review (€30k), the DPA negotiation (3 months of legal), the IT integration (6 weeks), and the ongoing maintenance. Add those up and your "fast payback" disappears.

**Current answer strength: 2/5**

The pitch does not address the total cost of ownership beyond the SaaS fee. The "ROI in under 3 months" claim is based on SaaS fee vs savings only.

**How to improve before jury:** Build a real TCO slide: SaaS fee + estimated security review + DPA + IT onboarding = total year-1 cost, vs measured savings. Even with those costs, the math should hold for a large hospital. If it doesn't hold for a small hospital, say so. Alternatively, offer to cover the onboarding cost (security review, DPA) for the first 3 design partners — this removes the TCO objection entirely for pilot customers.

---

### CIO-4. Your model needs 24 months of clean data. I can tell you now that our Pharmagest export has missing months, duplicate entries, and three different drug naming conventions. What happens to your model?

Real hospital data is dirty. Every DSIH knows this. If your first pilot fails because our CSV has 3 months of missing data in 2023, I need to know that upfront, not after we've signed a DPA.

**Current answer strength: 2/5**

The FAQ acknowledges this as "the hardest problem ahead" but doesn't describe a data quality pipeline that handles it gracefully.

**How to improve before jury:** Describe the data quality layer specifically: *"We run 6 validation checks before training: completeness (flag drugs with >2 consecutive missing months), deduplication (merge by ATC code + date), normalisation (map drug name variants to ATC code), unit consistency (flag unit changes), and outlier detection (flag orders >3σ from the drug's own distribution). Drugs that fail validation are excluded and flagged for manual review, not silently dropped. The pharmacist sees exactly which drugs were excluded and why."* This signals that you have thought about messy real data, not just clean synthetic data.

---

### CIO-5. What is your uptime SLA? What happens when Render goes down during our monthly ordering cycle?

I do 90% of my ordering in a 3-day window at the end of the month. If your API is down during that window, my pharmacist misses the order cycle. On Render's free tier, you have no SLA. You are asking me to trust a procurement tool with a €0 infrastructure budget.

**Current answer strength: 1/5**

The deployment section doesn't address uptime, SLA, or what happens when the free-tier server goes down. Render's free tier has known cold-start latency and no SLA guarantee.

**How to improve before jury:** Address this directly in the deployment strategy: *"The free tier is for hackathon demo only. Production deployments use Render's paid tier (€25/month, 99.5% uptime SLA) or — preferably — a Docker container running inside the hospital's own infrastructure, which means no external dependency at all. A pharmacist using the on-prem version is not dependent on our servers; they are dependent on their own hospital IT, same as Pharmagest."* On-prem is actually the right answer to this question — and it's architecturally consistent with HDS compliance.

---

### CIO-6. Your data stays "inside the hospital" but your frontend is hosted on Vercel. When my pharmacist uploads a CSV from her browser, where exactly does that file go?

The RGPD DPA I sign with you needs to specify every sub-processor. Vercel is a US company. If any CSV bytes touch Vercel's servers, I have a GDPR Article 46 transfer problem. Have you done a GDPR Transfer Impact Assessment?

**Current answer strength: 2/5**

The ARCHITECTURE.md says "no patient data ever leaves" but the demo page copy says "Your CSV is parsed locally — it is NOT sent to any server except our on-prem demo API." The phrase "except our on-prem demo API" is contradictory and will alarm a CIO.

**How to improve before jury:** Fix the demo page copy first (it's technically incorrect for the cloud deployment). Then prepare the answer: *"In the cloud demo, the CSV is sent directly from the browser to the FastAPI backend on Render (Frankfurt region, EU). It is not stored — it is parsed in memory and discarded after the response. Vercel only serves the static Next.js frontend; no CSV data passes through Vercel's servers. For production hospital deployments, the frontend is also hosted on the hospital's infrastructure, so no external data transfer occurs. We will include Render and Vercel as sub-processors in the DPA, with a Data Processing Agreement."*

---

### CIO-7. How do you handle a drug that is temporarily unavailable from the supplier — a supply disruption? Your historical data will recommend ordering something that can't be obtained.

Supply chain disruptions for generics happen 3–4 times per year in France (ANSM shortage list). Your model has no signal for this. It will confidently recommend 1,200 units of a drug that is on the ANSM shortage list.

**Current answer strength: 1/5**

This is a real gap. The forecaster has no drug availability signal. The FAQ does not address it.

**How to improve before jury:** Acknowledge the gap and describe the v1 workaround: *"Supply disruption signals are not in our current feature set — this is a known limitation. Our v1 workaround: the pharmacist can flag a drug as 'supply restricted' in the UI, which suppresses the recommendation and surfaces a 'manual review' badge. In v2, we plan to ingest the ANSM shortage RSS feed automatically and apply a disruption flag. This is a 2-week engineering task once we have real hospital deployments."* Knowing the ANSM has a public shortage list and planning to ingest it shows domain knowledge.

---

### CIO-8. Who maintains this model 18 months from now? You're a startup. What happens to my hospital if you shut down?

I've seen 3 "digital health" startups I integrated with go bankrupt in the last 4 years. Every time, I spent 6 months extracting data and rebuilding workflows. What is your contractual commitment to data portability and business continuity?

**Current answer strength: 2/5**

No business continuity or data portability commitment exists in the current documentation.

**How to improve before jury:** Add a business continuity commitment to the pitch: *"Our contracts include: (1) all hospital data is exportable in standard CSV format at any time, within 48 hours of request; (2) in the event of company dissolution, the model weights and source code are released to the hospital under an open-source licence; (3) the on-prem deployment option means the hospital can continue running the last stable version indefinitely without our servers."* Point 3 is actually a genuine advantage of on-prem over SaaS for hospital clients.

---

### CIO-9. Your demo shows SHAP explanations. In production, my pharmacist will see "waste_rate_lag1" as a feature name. That is meaningless to a clinician.

"Waste rate from last month increased by 14%" is not the same as "waste_rate_lag1 impact: −0.23." You are showing the jury a demo that works because you built it. Show me what a non-technical pharmacist sees on day 30 of using this tool.

**Current answer strength: 3/5**

The demo does translate feature names to plain language ("Waste rate over the last 6 months was 14%…"). But this is based on string templates, and the feature names are still visible in some parts of the UI. A CIO who has seen software demos before will probe this.

**How to improve before jury:** Before the demo, make sure every SHAP feature name in the UI is rendered in plain French/English — no underscores, no technical names visible to the pharmacist. If the top driver tooltip says "waste_rate_lag1" anywhere, fix it to "Waste rate (last 6 months)" today. Then show the CIO/jury the tooltip during the demo, zoomed in. Visual proof is stronger than a verbal claim.

---

### CIO-10. You claim your model runs on a commodity CPU in the hospital server room. What are the actual hardware requirements? RAM, CPU, storage?

"Commodity CPU" could mean a €300 Raspberry Pi or a €30,000 server. I need a spec sheet before I put this in my infrastructure plan.

**Current answer strength: 2/5**

No hardware requirements are documented anywhere. The demo runs on Render's free tier (512MB RAM, shared CPU).

**How to improve before jury:** Run `time python -c "import lgb; ..."` locally and measure peak RAM usage during training on the synthetic 1,080-row dataset. Then state it accurately: *"Training on 24 months of data for 15 drugs peaks at ~400MB RAM and completes in under 60 seconds on a single CPU core. Inference per request is under 50ms. Minimum hardware: 2GB RAM, 1 CPU core, 10GB disk. This runs on any server from the last 10 years — including hospital virtualisation infrastructure. We have verified this on [specific machine spec]."* Make this measurement actually, today.

---

## PERSONA 3 — MEDICAL ETHICS BOARD

*"Patient safety first. Explainability second. Bias third. Impress me."*

---

### ETH-1. You trained on 3 hospitals and 15 drugs. Your model has never seen an oncology ward, a paediatric unit, or a transplant centre. Deploying it there is reckless.

1,080 rows of data is not enough to capture the tail risks of specialised wards. A model that generalises from a rural hospital in Cantal to a paediatric oncology unit at Gustave Roussy is not generalising — it's guessing.

**Current answer strength: 2/5**

The FAQ acknowledges this as a limitation but the answer ("for orphan drugs we flag manual review") doesn't go far enough. The scope of the limitation is wider than orphan drugs — it's any specialised ward the training data doesn't represent.

**How to improve before jury:** Add an explicit scope statement to the product: *"Medora v1 is validated for high-volume, predictable drug classes in general wards: antibiotics (J01), analgesics (N02), cardiovascular (C09), antacids (A02). Oncology (L01), paediatrics, and transplant drugs are out of scope for v1 and are flagged as 'specialist review required' in the UI. These categories will be addressed in v2 after we have per-specialty training data from design partners."* Scoping the product honestly is both safer and more credible than claiming it works everywhere.

---

### ETH-2. SHAP explanations are correlational, not causal. A pharmacist who trusts the AI explanation might make a worse decision than one who ignores it.

SHAP tells you which features the model used, not why the relationship exists. If the model learned a spurious correlation from training data (e.g., "high patient visits in October → order more paracetamol"), the SHAP explanation will say "patient visits" with confidence, and the pharmacist will nod and accept it — even though the real driver is flu season, not visits. Trusted explanations create overconfidence.

**Current answer strength: 2/5**

The FAQ describes SHAP as if it provides causal understanding. It doesn't, and a clinical ethicist will know this.

**How to improve before jury:** Acknowledge the distinction: *"SHAP is correlational, not causal. We know this. Our explanation templates are designed to state correlation, not causation: 'Historically, when patient visits increase in October, amoxicillin orders correlate with higher demand' — not 'patient visits cause amoxicillin demand.' We train pharmacists during onboarding that SHAP drivers are patterns, not mechanisms. The override capability exists precisely for cases where the pharmacist's clinical knowledge overrides a spurious correlation."* The critical point is that you have thought about this distinction and it's reflected in the UI language.

---

### ETH-3. What happens to a drug the model has never seen? A new generic enters the market. Your feature pipeline has no data for it.

Hospital formularies change. New generics are listed, brand drugs are removed. Your model has never seen a drug with zero months of history. What does it output? A crash? A silent zero? A fabricated recommendation?

**Current answer strength: 2/5**

This is not addressed in the FAQ or architecture documentation. It's a real code path that probably fails ungracefully.

**How to improve before jury:** Test this case in the actual codebase before jury day. Run `forecaster.forecast("UNKNOWN_ATC", "HOSP_001", 1)` and see what happens. If it crashes, fix it to return a structured error. Then document the expected behaviour: *"Drugs not in the training data return a 'cold start' response: recommended_qty = null, flag = 'new_drug_manual_review', reasoning = 'No historical data available. Recommend ordering based on formulary guidelines.'* Never silently output a fabricated number.

---

### ETH-4. Your 5% safety margin is arbitrary. Where did that number come from? What's the clinical basis?

"5% base buffer" is a made-up number. It didn't come from a clinical study. It didn't come from a pharmacovigilance analysis. It came from a developer deciding it felt safe. That's not how safety margins work in a clinical context.

**Current answer strength: 1/5**

This is completely accurate. The 5% is hardcoded in `forecaster.py` without clinical justification. In a medical context, this will be challenged.

**How to improve before jury:** Either find a clinical reference that justifies a 5% safety margin for non-critical drugs (there is likely literature on par-level buffer stock in hospital pharmacy management), or change the narrative: *"The 5% base buffer is a conservative default we will calibrate with our first clinical advisor. It is a floor, not a ceiling. For critical drugs, the buffer is automatically set to the 95th percentile of the confidence interval. For non-critical drugs, the appropriate buffer will be determined per drug class in collaboration with a hospital pharmacist. We welcome challenge on this number — it's one of the first things our clinical advisor will validate."* Inviting challenge is stronger than defending an arbitrary number.

---

### ETH-5. You said "no patient data." But patient visit counts are in your feature set. That's health-adjacent data. What's your legal basis for processing it?

`patient_visits` is in your required CSV columns. In a French hospital, patient visit counts are extracted from the DPI (Dossier Patient Informatisé). Even if aggregated, they are derived from patient data. Have you analysed whether this constitutes "processing of health data" under RGPD Article 9?

**Current answer strength: 2/5**

The compliance section says "no patient data" but `patient_visits` is in the data contract. This is a genuine tension that a data ethicist or CNIL auditor will find.

**How to improve before jury:** Clarify the legal position precisely: *"'Patient visits' in our data model is a count per month per hospital ward — not per patient. There is no patient identifier, no individual health record, and no link to a specific patient. Under French RGPD guidance (CNIL, February 2024), aggregated ward-level activity statistics do not constitute health data under Article 9 if they cannot be re-linked to an individual. We will confirm this interpretation with our legal advisor before production deployment. If CNIL disagrees, we will remove `patient_visits` from the feature set — it contributes less than 8% to model accuracy in our synthetic benchmarks and the model functions without it."* That last sentence (backup plan without the feature) is critical.

---

### ETH-6. You claim the pharmacist "can override with one click." In practice, pharmacists under time pressure click Accept. Have you done any UX research on automation bias in clinical decision support?

Automation bias — the tendency to defer to algorithmic recommendations — is well-documented in clinical settings. Your "override" is a fig leaf if the interface defaults to Accept and presents the override as the deviation. You are building a compliance theatre, not a safety mechanism.

**Current answer strength: 2/5**

The FAQ acknowledges the override exists but doesn't address the design of the override interface or automation bias risk. The current MVP has no override UI at all — it's read-only.

**How to improve before jury:** Commit to a specific anti-automation-bias design principle: *"Our v2 approval workflow is designed to require active confirmation, not passive acceptance. The pharmacist types the quantity they intend to order — the system does not pre-fill the field with the recommendation. This forces cognitive engagement. We based this on NHS guidance for clinical decision support tools (NHS Digital, 2022) which recommends 'no default accept' design patterns."* Reference a specific guideline. Also acknowledge the current MVP is read-only, which actually prevents automation bias entirely at this stage.

---

### ETH-7. What about drug interactions and therapeutic substitutions? A pharmacist who orders less paracetamol might compensate with a different analgesic that has different waste characteristics. Your model doesn't know this.

Hospital pharmacy is not a set of independent drugs. Drugs substitute for each other. If you reduce amoxicillin orders, the pharmacist may order more of an alternative antibiotic that isn't in your dataset. Your total waste calculation is incomplete.

**Current answer strength: 1/5**

This is a genuine limitation not addressed anywhere in the documentation. The model treats each drug as independent.

**How to improve before jury:** Scope this limitation explicitly in the product: *"We model each drug independently — drug-drug substitution effects are out of scope for v1. This means our savings estimates are conservative: if a pharmacist substitutes a reduced drug with an alternative, the waste reduction may be lower than we project. In v2, we plan to model ATC sub-class substitution patterns. For the jury: our impact numbers are best understood as 'per drug' savings, not 'formulary-level' savings."* Underpromising on the impact number is counterintuitive but builds credibility with a clinical audience.

---

### ETH-8. Who audits the model after deployment? If the model drifts and starts recommending consistently wrong quantities, how long before anyone notices?

Models decay. A model trained on 2023–2024 data will perform differently in 2027 after a pandemic, a supply chain crisis, or a formulary change. Who monitors drift? What's the alert threshold? What's the rollback procedure?

**Current answer strength: 2/5**

The FAQ mentions "automatic retraining on a schedule" in the roadmap but gives no specifics on monitoring, drift detection, or rollback.

**How to improve before jury:** Describe a concrete monitoring protocol: *"Our monitoring protocol: (1) each month, we compare the model's recommended quantity against actual orders for the previous month — if the mean absolute error increases by >20% versus baseline, we alert the pharmacist and hospital IT; (2) automatic retraining fires when new monthly data arrives; (3) rollback to the previous model version is a one-command operation (Docker tag swap). The pharmacist dashboard shows a 'model confidence' indicator that decreases if recent predictions have been consistently overridden — this is a proxy for drift that requires no technical knowledge to understand."*

---

### ETH-9. Your ecotoxicity scores are static constants by ATC prefix. Real ecotoxicity depends on the specific molecule, not just the drug class. L01 is not one substance — it covers 200 different antineoplastic agents with wildly different environmental profiles.

Using "L01 = 90" as an ecotoxicity constant conflates erlotinib with methotrexate with cyclophosphamide. These molecules have completely different aquatic toxicity profiles. Your ecotoxicity numbers are not wrong — they are meaningless at the level of precision you're presenting them.

**Current answer strength: 2/5**

This is technically accurate and damaging if raised by a clinical audience. The constants are coarse-grained proxies, not per-molecule values.

**How to improve before jury:** Acknowledge and contain the limitation: *"You are correct. Our ecotoxicity scores are ATC class-level proxies, not per-molecule values. They are sourced from UNEP 2019 meta-analysis which uses this same level of aggregation. The correct use of our ecotoxicity output is as a relative ranking tool — 'oncology drugs have higher ecotoxicity potential than analgesics' — not as an absolute kg-of-toxin number. We do not report ecotoxicity in physical units for exactly this reason. We use a dimensionless score (0–100) and a class label (low/moderate/high/critical) to avoid false precision."* Defending the relative framing (ranking vs absolute) is the right move here.

---

### ETH-10. Your model is a "global model" trained across all hospitals. That means Hospital A's data influences Hospital B's recommendations. Is that appropriate? Did the hospitals consent to this?

Cross-hospital training is data sharing in disguise. Even if you remove identifiers, the model weights encode information from every hospital in the training set. If Hospital A has an unusual drug usage pattern due to a local epidemic, that pattern influences Hospital B's recommendations without B's knowledge.

**Current answer strength: 2/5**

The architecture describes a global LightGBM model as a deliberate design choice, but the privacy implications of cross-hospital knowledge transfer are not addressed in the compliance section.

**How to improve before jury:** This is a real privacy design question that needs a clear answer: *"In the current MVP, the global model is trained only on synthetic data — no real hospital has consented to anything yet. For production: each hospital deployment trains a model on that hospital's data only, with hospital_id as a feature (not a cross-hospital shared model). This is the architecturally correct design for HDS compliance — data from Hospital A never influences Hospital B's model in production. The global model in our code is a single-hospital MVP convenience; it becomes a per-hospital model in deployment."* This may require a clarification in ARCHITECTURE.md to avoid future confusion.

---

## SYNTHESIS

### Top 5 weaknesses identified

These are the 5 most dangerous objections across all 30 questions. They are dangerous because they are (a) valid, (b) hard to answer without evidence, and (c) likely to be asked.

**1. Zero traction (VC-1).** No real hospital has touched the product. Every other answer is undermined if this is the first question asked. It is a confidence killer.

**2. Synthetic accuracy is circular (VC-3).** "15–22% waste reduction" computed on synthetic data is not an accuracy claim. An experienced technical jury will identify this immediately.

**3. The 5% safety margin is arbitrary (ETH-4).** In a medical context, any arbitrary safety constant will be challenged. There is no clinical basis documented.

**4. Incorrect TAM framing (VC-9).** Presenting €80B as TAM for a tool that charges €20/bed/month is analytically wrong. It signals that the team hasn't done the revenue math, which raises doubts about all the other numbers.

**5. No supply disruption handling (CIO-7).** The model cannot handle a drug on the ANSM shortage list. Pharmacists will think of this immediately, because shortages happen every quarter in France.

---

### Mitigation plan (before jury day)

**Weakness 1 — Zero traction:**
Prepare one slide or one spoken sentence with the name of a specific institution and a specific contact title you have already emailed or plan to email this week. *"We sent an intro email to the pharmacy director of CHU [X] on [date]. We have a call scheduled."* Even an unconfirmed meeting is better than no plan.

**Weakness 2 — Synthetic accuracy:**
Find one external academic reference showing gradient boosting on hospital supply chain data achieving 10–20% waste reduction. Add it to PITCH_NUMBERS.md and cite it in the deck. Even a supply chain paper outside healthcare strengthens the claim.

**Weakness 3 — Arbitrary 5% safety margin:**
Add one sentence to the demo's "How Medora computed this" section: *"Safety buffers follow WHO/ASHP buffer stock guidelines for non-critical drugs. Critical drugs always use the 95th percentile confidence interval."* If you cannot find a specific WHO reference today, say the buffer is configurable and will be validated with a clinical advisor — that's honest and shows you know the gap.

**Weakness 4 — TAM framing:**
Fix the market slide before the presentation. Use the beds × price-per-bed calculation (€600M EU, €96M France). It is smaller but honest. Add the adjacency revenue streams (CSRD attestation, carbon credits) as expansion layers above the SaaS ceiling.

**Weakness 5 — Supply disruption:**
Add a one-sentence feature to the product: a "flag drug as restricted" toggle on any drug row in the demo table. It takes 30 minutes to build and it gives you a concrete answer to the CIO question: *"You click this toggle, the drug is removed from AI recommendations and flagged for manual procurement."* Ship this today.

---

### Questions we cannot answer well

These are the 3 questions where even our best answer is structurally weak. Do not bluff. Deflect with honesty.

**1. "What is your real-world accuracy?" (VC-3, ETH-1)**

We cannot answer this. We have no real data. The honest deflection: *"We don't know yet, and we won't pretend otherwise. Our synthetic benchmark shows 15–22% waste reduction. The first thing our design partner pilot will produce is a real accuracy number. If that number is 8% instead of 18%, we will publish it and recalibrate our pitch. We'd rather give you a real number in 6 months than a made-up number today."* Juries respect teams that know what they don't know.

**2. "Do you have an MDR legal opinion?" (CIO-2, ETH-4)**

We do not. The honest deflection: *"We don't yet have a written MDR opinion — that requires engaging a regulatory lawyer, which we will do in month 1 with pre-seed capital. What we can say is: we have read MDCG 2019-11 guidance and our strong belief is that procurement optimisation is not an MDR-regulated function. We are designing on that assumption and will get a written opinion before any production hospital deployment. We will not deploy without it."*

**3. "Why you?" (VC-5)**

We cannot answer this well without a named clinical advisor or a prior hospital relationship. The honest deflection: *"Honestly, today our advantage is: we built this in 72 hours and it works. That's evidence of execution speed. The clinical advisor and hospital BD relationships are the next 30 days' work. If you're asking whether we have the unfair advantage today — not yet. We're building it."* Admitting the gap directly is more credible than a vague answer about "combined expertise."
