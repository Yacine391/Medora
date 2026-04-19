# Medora — Jury & Investor FAQ

30 questions. Each has a short answer (30 seconds) and a long answer (2 minutes).

Numbers match `ARCHITECTURE.md` and `docs/PITCH_NUMBERS.md`.

---

## MARKET

### Q1. How big is this market really?

**Short (30s):** The European hospital medicine procurement market is ~€80 billion. We address the 15% that is wasted — roughly €12 billion. France alone is €1.7 billion, directly cited by the Cour des comptes in 2025.

**Long (2m):** The TAM is European hospital medicine procurement: ~€80B per year (EMA market data 2023). Our SAM is the addressable waste fraction — published waste rates range from 12–25%; we use a conservative 15%, giving a €12B SAM across Europe. In France specifically, the Cour des comptes (Sept 2025) named €1.7B in waste as a priority fiscal target — so the French SAM is actually a published government number, not our estimate. Our SOM in 5 years is ~€12M: 50 paying hospitals in France at an average of €240k ARR each. That assumes a 1% penetration of the French SAM, which is achievable with a 3-person sales team in a market where every hospital is under active political pressure to cut procurement costs.

---

### Q2. Aren't hospitals already doing this with Excel?

**Short (30s):** Yes. And that's why 7,675 tons are thrown away every year. Excel doesn't process 30 features, doesn't adjust for seasonality, stockout history, or lead time variance. A pharmacist with a spreadsheet cannot run that calculation for 200 drugs in 10 minutes.

**Long (2m):** Most hospital pharmacies use a simple method: order the same quantity as last month, adjusted by gut feeling. Some have basic par-level replenishment in their ERP (Pharmagest, Dedalus). None of these systems look at waste rate trends, seasonal demand shifts, stockout patterns, or patient visit correlations simultaneously. Our LightGBM model uses 30 features engineered from 24+ months of history. In our synthetic benchmarks, this reduces over-ordering by 15–22% compared to a naive "same as last month" baseline. The Excel question is actually our best opening — it confirms that our competition is a spreadsheet, not a funded startup.

---

### Q3. Why France first and not the US?

**Short (30s):** France has the clearest, most public pain point: a government report naming €1.7B in waste, CSRD 2026 forcing emissions reporting, and a defined regulatory path (HDS certification). The US has HIPAA complexity, fragmented payer systems, and GPO dynamics that would add 12 months to every sales cycle.

**Long (2m):** Three things make France the right starting market. First, the demand signal is explicit: the Cour des comptes 2025 report was political pressure directed at hospital procurement heads — they are actively looking for solutions right now. Second, CSRD 2026 means every large French hospital must publicly report Scope 3 emissions; medicine procurement is their largest source and they have no tool for it. Medora becomes a compliance instrument, not just a cost tool. Third, HDS certification is a technical moat: solving the French regulatory stack correctly (RGPD + HDS + MDR pre-qualification) takes 6–18 months — any competitor entering France faces the same barrier. The US is a 3–5 year opportunity after we have a proven French case study and Series A capital.

---

### Q4. Who's your competition? What about SAP and Oracle ERP modules?

**Short (30s):** The main competitor is inaction — hospitals using par levels or Excel. SAP and Oracle have inventory modules but none with ML-based demand forecasting for hospital pharmaceuticals with SHAP explainability. There are US-based pharmacy analytics startups (Swisslog, Omnicell) but none are in the French market with HDS compliance.

**Long (2m):** We have mapped four categories of competition. (1) **Status quo**: Excel + par levels. This is 80% of French hospitals today. (2) **ERP modules**: SAP IS-H and Oracle Healthcare have inventory features, but they are generic manufacturing inventory tools. They do not engineer pharmaceutical-specific features (waste rate, ecotoxicity, seasonal pathology demand). They also require 18-month enterprise implementations. (3) **US pharmacy automation** (Omnicell, Swisslog, BD): focused on physical dispensing robots and counting, not demand forecasting. Not HDS-certified. Sales cycles of 3–5 years for French public hospitals. (4) **AI startups**: we are not aware of a French or European startup doing exactly this. The closest is Hector AI (logistics AI) but focused on general supply chain, not pharmaceutical waste. Our moat is the combination of HDS compliance by design, SHAP explainability for pharmacists, and CSRD reporting output — none of the incumbents have all three.

---

### Q5. Why would a French CHU pay you versus waiting for the government to fix it?

**Short (30s):** The government report named the problem in 2025. The government will not ship software. Hospital CFOs have a budget problem now and CSRD reporting obligations starting in 2026. They will pay for a tool that works next quarter.

**Long (2m):** French hospital procurement runs on an annual budget cycle. A CHU that over-orders by €180k in 2025 has a fiscal pressure from the ARS (Agence Régionale de Santé) to justify it. The Cour des comptes report did not come with a public procurement platform — it created political pressure with no relief valve. We are the relief valve. The CFO and pharmacy director can show the ARS a concrete tool with a ROI number: "we reduced pharmaceutical waste by 18%, saving €32k this quarter." CSRD 2026 adds a second forcing function: large hospitals must produce an audited Scope 3 emissions report. Medicine procurement is the largest line item and they have no methodology. Medora's CO₂ output, sourced from Shift Project and ADEME, gives them a defensible number. Waiting for the government means waiting for a procurement tender process that takes 24 months minimum. Our design partner offer (free tool + co-authored case study) removes the budget objection entirely for the first hospital.

---

## TECH

### Q6. Why LightGBM and not a transformer or LLM?

**Short (30s):** LightGBM trains in seconds on tabular data with 30 features, produces SHAP explainability natively, and runs entirely on-premise without GPU. A transformer would need orders of magnitude more compute, can't be explained to a pharmacist, and would require external API calls — which HDS compliance forbids.

**Long (2m):** Transformers and LLMs are the right tools for language and sequence problems. Our problem is structured tabular forecasting: we have one row per drug per hospital per month, 30 engineered features, and we need to predict one number (optimal order quantity). For this problem class, gradient boosting consistently matches or beats deep learning on benchmark datasets, trains in under 30 seconds on our 1,080-row synthetic dataset, and can run on a commodity CPU inside the hospital's server room. LightGBM also has native SHAP integration via the `shap.TreeExplainer`, which gives us feature importance at the individual prediction level — critical for a pharmacist who needs to understand *why* the model says 980 instead of 1200. Finally, the no-GPU, no-external-call deployment requirement is non-negotiable for HDS compliance. A cloud LLM call at inference time would disqualify the product from any French hospital deployment.

---

### Q7. What if the hospital has less than 12 months of historical data?

**Short (30s):** The model degrades gracefully. With 12 months, it loses seasonal signals but still uses waste rate, lead time, and demand lags. Below 6 months, we surface a warning and default to a conservative +10% safety margin on the naive baseline.

**Long (2m):** Our feature engineering requires a minimum of 6 months to compute meaningful lags (3-month and 6-month rolling means, waste rate trend). Between 6 and 12 months, we drop the annual seasonal features (flu season coefficient, 12-month lag) and rely on the shorter-window features. Performance degrades, but a 12% accuracy reduction is still better than Excel. Below 6 months, we do not produce a model prediction — instead, we flag the drug as "insufficient data" and recommend a manual review with a conservative buffer. This is documented in the UI. For new hospitals or new drugs, we also plan a cold-start module (v2 roadmap) that uses population-level ATC class benchmarks to seed priors until local data accumulates.

---

### Q8. How do you avoid dangerous under-ordering? (patient safety)

**Short (30s):** The model never recommends below a minimum safety stock threshold. We apply a 5% base safety margin on every recommendation, plus a rural penalty, plus a lead time variance penalty. The pharmacist always sees confidence intervals and can override with one click.

**Long (2m):** Patient safety is the first design constraint, not an afterthought. The forecaster computes a base recommended quantity and then applies three additive safety layers: (1) a flat 5% buffer on all recommendations; (2) a rural penalty (+5% for hospitals flagged `is_rural=true`) because rural supply chains are less reliable; (3) a lead time variance penalty proportional to the standard deviation of historical lead times — if a drug sometimes arrives 2 weeks late, we add more buffer. The output is always a quantity *and* a confidence interval (confidence_low, confidence_high). The demo UI shows only the recommended quantity, but the API returns all three. The pharmacist can override — the system logs the override but does not block it. This is intentional: we are a decision support tool, not an autonomous agent. That distinction is also what keeps us out of MDR Class IIa territory. Finally, for critical drugs (ICU, oncology, emergency) we plan a "never-stockout" flag in v2 that forces the model to the 95th percentile confidence interval instead of the median.

---

### Q9. How explainable really is it? Can a pharmacist override?

**Short (30s):** Every recommendation shows the top 3 SHAP drivers with a plain-language explanation, the percentage contribution, and the direction. The pharmacist overrides by adjusting the quantity directly in the tool — the model does not re-run automatically.

**Long (2m):** SHAP (SHapley Additive exPlanations) is a game-theory-based method that attributes each feature's contribution to the final prediction. For LightGBM, we use `shap.TreeExplainer`, which computes exact SHAP values without approximation. The top 3 drivers are surfaced in the UI as: feature name (e.g. "waste_rate_lag1"), impact percentage (e.g. "−18%"), direction (down), and a human-readable explanation generated from a template (e.g. "Waste rate over the last 6 months was 14% — above average. This suggests current orders exceed real demand."). The pharmacist sees this inline, in the same row as the recommendation. Override works as follows: the UI is read-only in the current MVP — the pharmacist takes the number and enters it in their ERP. In v2, we will offer a direct ERP connector with an approval workflow, where the pharmacist approves, modifies, or rejects each line item. We believe the combination of SHAP explainability and human override is the right design for a medical-adjacent procurement tool — it keeps the pharmacist in control and keeps us out of autonomous decision-making territory.

---

### Q10. What's your accuracy on real data?

**Short (30s):** Honest answer: we don't know yet. We are trained on synthetic data. Our synthetic benchmark shows 15–22% waste reduction vs baseline. We expect real accuracy to be lower — our target for first pilot is a measurable, statistically significant reduction, even if smaller.

**Long (2m):** We will not invent a real-data accuracy number we don't have. The model is trained on 1,080 rows of synthetic data generated from published statistics (Cyclamed waste rates, Shift Project seasonality patterns, realistic lead time distributions from DREES). In held-out synthetic test data (25% split), the model reduces over-ordering by 15–22% vs a naive baseline. On real data, we expect three sources of degradation: (1) distribution shift — real waste rates may differ from synthetic distributions; (2) data quality — real hospital CSVs have missing values, unit inconsistencies, and ERP export artifacts; (3) drug-specific edge cases — orphan drugs, seasonal stockouts, political supply disruptions. Our target for the first design partner pilot (month 1–6) is to demonstrate a statistically significant reduction in waste rate, validated against actual monthly inventory reports. We will publish the methodology and results transparently, even if the number is 8% instead of 18%.

---

### Q11. How do you integrate with existing pharmacy software?

**Short (30s):** Today: CSV upload, 2 minutes. Version 2: read-only API connectors for Pharmagest, Dedalus, and SAP IS-H. These are the three systems covering ~70% of French hospital pharmacies.

**Long (2m):** The current MVP uses a CSV upload. The format is documented (9 required columns, 4 optional). For a hospital pharmacist, exporting a 2-year CSV from Pharmagest or Dedalus takes about 5 minutes — we have verified this manually with the Pharmagest export documentation. The file is parsed client-side, never stored on any external server. For v2, we plan read-only REST connectors for the three dominant systems in French hospitals: Pharmagest (market leader, ~40%), Dedalus (second, ~20%), SAP IS-H (large CHUs). These are API integrations that pull the last 24 months of procurement data automatically on a weekly schedule. We have contacted Pharmagest about their partner API program — it is open and documented. The connector work is roughly 6 weeks of engineering per system. Writing to the ERP (placing orders directly) is v3 and requires a deeper compliance review, but is not needed for the tool to deliver value.

---

## ETHICS & SAFETY

### Q12. What if your AI recommends too few units and a patient dies?

**Short (30s):** The model never recommends below a minimum safety threshold. Pharmacists can override. We are a decision support tool, not an autonomous ordering agent. The pharmacist approves every order. Liability stays with the pharmacist, as it does today.

**Long (2m):** This is the right question and we take it seriously. Three things protect against under-ordering: (1) the safety margin system (5% base + rural + lead time variance — described in Q8); (2) the confidence interval output — the pharmacist always sees the uncertainty range, not just a point estimate; (3) the override mechanism — no recommendation goes to the ERP automatically. The pharmacist approves each line. We are a decision support system, analogous to a clinical decision support tool. In this category, liability is well-established: the professional (pharmacist, physician) retains responsibility for the final decision. We provide a recommendation and the reasoning behind it; we do not act autonomously. We are also in pre-review discussion about MDR qualification (Q13) — the strong signal from legal counsel is that we are likely exempt or Class I because we optimise procurement, not treatment. But we will get a written legal opinion before any production hospital deployment.

---

### Q13. Is this a medical device? What about MDR qualification?

**Short (30s):** Likely not. We optimise how much medicine to order — a logistics and procurement function, not a clinical decision. The MDR (EU 2017/745) applies to software that influences clinical diagnosis or treatment. We are awaiting a formal legal opinion.

**Long (2m):** The EU MDR (Medical Device Regulation 2017/745) defines medical device software as software that "provides information used to make decisions with diagnosis or therapeutic purposes." Medora tells a pharmacist how many boxes of amoxicillin to order next month — this is a procurement and logistics function. It does not advise on which drug to prescribe, what dose to give a patient, or how to diagnose a condition. Our preliminary reading of the MDR guidance (MDCG 2019-11) suggests we fall outside the definition. The strongest argument: if the recommendation is wrong (too few ordered), the consequence is a stockout leading to a delayed prescription — this is an operational failure, not a clinical one. The prescribing physician does not see our output. We are however conservative: we have scoped a formal legal opinion (estimated: €3–5k from a healthcare regulatory law firm), which we will commission before signing any paying hospital contract. We will not deploy into a production hospital environment without that written opinion.

---

### Q14. How do you handle rare or orphan drugs with zero waste tolerance?

**Short (30s):** For drugs with fewer than 6 months of data, or drugs where any stockout is life-threatening, the model flags them as "manual review required" and defaults to a conservative baseline. We do not produce a recommendation for drugs we cannot model safely.

**Long (2m):** Orphan drugs (rare disease treatments) have specific characteristics that make them hard to forecast: very low order frequency (sometimes 1–2 units per month), extremely high unit cost (€10k–€500k per unit), and zero tolerance for stockout. Our model handles this in two ways. First, during training, drugs with fewer than 24 monthly data points are excluded from the global LightGBM model — there is not enough signal. For these drugs, the UI shows a "Insufficient data — manual review" badge instead of a recommendation. Second, we plan a criticality flag in the drug profile (v2): any drug flagged "critical" will automatically receive the 95th percentile of the confidence interval as the recommendation, not the median. This biases toward over-ordering for critical drugs — exactly the right trade-off when under-ordering could harm a patient. The net effect is that Medora reduces waste on the high-volume, predictable drugs (antibiotics, analgesics, cardiovascular) and leaves the rare, critical, low-volume drugs to the pharmacist's judgment.

---

### Q15. What about the CNIL and the EU AI Act (Aug 2026)?

**Short (30s):** We are CNIL-aligned because no personal data is processed. The AI Act classifies us as limited-risk or minimal-risk — we are not in the high-risk Annex III category because we do not make clinical decisions. We will re-assess when the Act is fully in force.

**Long (2m):** Two regulatory frameworks: CNIL (French data protection, under RGPD) and EU AI Act (2024, phased enforcement). On CNIL: our data model processes aggregated procurement records — drug codes, quantities, dates, costs. It does not process patient identifiers, patient records, or individual health data. The input data is the same data a logistics manager would see in a stock management system. No CNIL notification or DPO consultation is required for this category of processing. On the EU AI Act: the Act creates a "high-risk" category (Annex III) for AI systems used in healthcare that make decisions affecting individual health outcomes. Our system does not make individual patient decisions — it makes batch procurement recommendations at the hospital-level. Our legal reading is that we fall in the "limited risk" or "minimal risk" tier, which requires only a transparency obligation (telling the pharmacist they are interacting with an AI). We will do a formal Act compliance review before the product reaches market — and we will document this in our DSFA (Data Security and Functional Analysis required by HDS).

---

### Q16. Who is responsible if your recommendation causes a stockout?

**Short (30s):** The pharmacist who approved the order. Medora is a recommendation tool — the pharmacist reviews, can override, and makes the final decision. This is the same liability model as clinical decision support software.

**Long (2m):** Liability in the decision support software category is well-established in French and EU law. The operator of a recommendation system is not liable for the outcome of a human professional's decision, provided: (1) the recommendation was clearly labelled as advisory; (2) the professional had the ability to override; (3) the system did not conceal relevant information. All three conditions are satisfied in Medora's design. The pharmacist sees the recommendation, the confidence interval, the top 3 drivers, and a one-click override. The system logs what was recommended and what was actually ordered — this audit trail is important for both liability protection and model improvement. We will formalise this in the Terms of Service and the DPA (Data Processing Agreement) we sign with each hospital. We are not taking on clinical liability. We are in the same category as a demand forecasting tool at any pharmaceutical distributor.

---

## BUSINESS

### Q17. What's your pricing?

**Short (30s):** €20 per bed per month (flat) or 10% of measured savings (shared upside model). A 500-bed hospital pays €120k/year flat — less than their savings in the first quarter.

**Long (2m):** We offer two models based on customer preference. The flat model (€20/bed/month) is predictable for the hospital's budget process and easy to justify: a 500-bed hospital at €120k/year is less than 0.1% of their annual medicine procurement budget, and our tool saves them 15–22% of their waste — roughly €30–50k in year one for a mid-size hospital. The shared upside model (10% of measured waste reduction) aligns incentives: if the tool doesn't save money, we don't charge. This is attractive for risk-averse procurement heads and removes the need for an ROI justification in the approval process. We measure savings by comparing actual procurement spend 6 months after deployment against a control period. Both models include onboarding, model maintenance, and monthly reports. We do not charge for data ingestion or training — the model retrains automatically on new data. Annual contracts, hospital-level. Volume discount for GHT groups (multi-hospital contracts).

---

### Q18. What's the sales cycle for a hospital? 18 months?

**Short (30s):** For a standard paying contract, yes, 12–18 months is realistic for a French public hospital. That's why we start with design partner agreements — no money, no procurement process, just a signed letter of intent and a CSV file.

**Long (2m):** French public hospital procurement is governed by public procurement law (Code de la commande publique). Any contract above €40k requires a formal tender process (appel d'offres), which takes 6–12 months minimum. Below €40k, a direct contract is possible. This means our first customers either come through: (1) a design partner agreement (no payment, no procurement process, just a DPA and a handshake) that converts to a paid contract after a 3-month pilot; or (2) a contract below the tender threshold — a 50-bed rural hospital at €20/bed = €12k/year, well below the limit. Our go-to-market strategy is therefore: target rural hospitals and medium-sized CHs (50–300 beds) for first paid contracts, and simultaneously cultivate unpaid design partnerships at 1–2 large CHUs to build credibility and case studies. The CHU case study is what unlocks the large contracts — procurement committees want peer references from institutions of similar size and complexity.

---

### Q19. What's your CAC and LTV?

**Short (30s):** Honest assumption: CAC €15–30k (1–2 months of one BD person's time + travel + events). LTV €240k–500k (2–4 year contract at €120k/year for a 500-bed hospital). LTV/CAC ratio of 8–15×.

**Long (2m):** These are honest estimates based on the SaaS industry benchmark for healthcare B2B, not measured data. CAC: a hospital sale requires 10–20 in-person meetings, attendance at 2–3 pharmacy conferences (e.g. SNPHPU, SoFHT), and a 3-month proof-of-concept period. At a fully-loaded cost of €150k/year for a clinical sales rep in France, and 5–8 hospital closes per rep per year, CAC is €20–30k. This is consistent with French healthtech benchmarks. LTV: we assume a 3-year average contract length (hospitals are sticky — switching costs are high once the tool is integrated into the workflow). A 500-bed hospital at €20/bed = €120k ARR × 3 years = €360k LTV. LTV/CAC = 12×, which is strong. For GHT group contracts (10–15 hospitals), LTV is €1.2–1.8M per deal, and the CAC is not proportionally higher — one BD relationship covers the group.

---

### Q20. Why would a hospital buy from a hackathon team?

**Short (30s):** Because the product works, the numbers are sourced, and the team is credible enough to get to a pilot. Hospitals don't buy teams — they buy solutions to problems they have right now.

**Long (2m):** This is a fair challenge. Our response is threefold. First, we are not asking a hospital to buy anything at this stage — we are asking for a design partner relationship: give us your CSV, we give you a free CO₂ and cost report. The commitment is a PDF and a handshake, not a procurement process. Second, the product works today. A pharmacist can go to our URL right now, upload a CSV, and get a recommendation in 30 seconds. That is a higher bar than most funded startups at Series A. Third, the team has the right complementary skills for this problem. If we win this hackathon, we also have a credibility signal we can use with the first hospital call. The honest answer is: the first hospital will take a bet on us because of personal relationships, not brand. That is normal for B2B healthcare. The second hospital takes a bet because the first hospital vouches for us.

---

### Q21. Revenue in 12 months and 36 months?

**Short (30s):** Month 12: €60–90k ARR (3 small hospitals at €20–30k each). Month 36: €500k–1M ARR (15–20 hospitals, first group contract). These are targets, not guarantees.

**Long (2m):** Month 12 ARR of €60–90k assumes: 3 paying pilot hospitals, starting with smaller institutions (50–200 beds) where the procurement process is shorter. At €20/bed, a 100-bed hospital = €24k/year, a 200-bed hospital = €48k/year. Three such contracts = €60–90k ARR. This requires closing the first paying contract by month 6 (post-pilot conversion) and two more by month 10. This is achievable with one focused BD person in the field. Month 36 ARR of €500k–1M assumes: the first CHU contract (500–1,000 beds = €120–240k/year), one GHT group contract (5 hospitals = €300k/year), and 5–10 additional mid-size hospitals. This requires Series Seed capital to hire 2 additional people (1 sales, 1 engineer for ERP connectors). If we do not raise, we grow more slowly along the same trajectory — it takes 48 months instead of 36.

---

### Q22. What's your moat? Couldn't an incumbent copy this in 6 months?

**Short (30s):** Three layers of moat: HDS compliance (6–18 months to get right), proprietary waste data from design partners (training advantage), and pharmacist workflow integration (sticky once embedded). A large incumbent could copy the algorithm in 6 months. They cannot copy the HDS certification or the hospital relationships.

**Long (2m):** Any technical algorithm can be replicated. Our defensibility is not in the LightGBM model itself. It comes from: (1) **Regulatory compliance**: HDS certification requires a formal security audit, penetration testing, legal review, and a French data hosting agreement. This takes 6–18 months and costs €20–50k minimum. An incumbent entering France from outside faces this barrier cold. (2) **Data network effect**: each hospital that uses Medora trains us on real waste patterns for specific drug classes and geographies. Over time, our prior distributions become more accurate for cold-start hospitals. This advantage compounds. (3) **Workflow stickiness**: once a pharmacy team uses Medora for their monthly order process, switching requires retraining staff, re-exporting 24 months of data, and re-running a pilot. The switching cost is 2–3 months of disruption. (4) **CSRD output**: if we become the tool hospitals use to produce their CSRD Scope 3 medicine waste report, we are embedded in a compliance workflow — switching risk is regulatory, not just operational.

---

## IMPACT

### Q23. Your CO₂ numbers look small (0.1% of France's total). Is climate really the angle?

**Short (30s):** At one hospital, yes — the numbers are modest. At national scale (3,000 hospitals), 1Mt CO₂e avoided is equivalent to 200,000 cars off the road for a year. Climate is one angle. Cost and CSRD compliance are the primary buying triggers.

**Long (2m):** The climate impact of a single hospital using Medora is real but not headline-grabbing in isolation. The strategic framing is: we are building the infrastructure that makes pharmaceutical waste measurable for the first time. Once hospitals can measure it accurately, they can reduce it — and then report it for CSRD. The CO₂ angle is most powerful for three audiences: (1) hospital sustainability directors, who need a Scope 3 methodology that is auditable and sourced; (2) ESG-focused investors, who see the carbon market potential as an add-on revenue stream (carbon credits for verified pharmaceutical waste reduction); (3) the general public and press, who respond to the "medicines thrown in the incinerator" narrative better than "working capital optimisation." The primary commercial driver is cost: hospitals pay because it saves them money. The sustainability angle is the door-opener, the differentiation, and the CSRD compliance value. We do not oversell the CO₂ numbers — we source them precisely (Shift Project, ADEME, Cyclamed) and present them accurately.

---

### Q24. How do you measure real impact versus estimated?

**Short (30s):** We compare actual quarterly procurement spend and waste volume against a 6-month pre-deployment baseline. The measurement methodology is documented, sourced, and repeatable. We do not claim savings we cannot verify.

**Long (2m):** The impact measurement protocol for a real deployment: (1) collect 6 months of pre-Medora baseline (actual orders, actual waste logs from the pharmacy system); (2) deploy Medora; (3) after 3 months, compare: actual orders, actual waste, actual expired units. The delta is attributed to Medora recommendations that the pharmacist approved. We distinguish between full adoption (pharmacist followed recommendation) and partial adoption (pharmacist overrode by >10%), and measure impact separately for each group. CO₂ and ecotoxicity savings are then computed from the actual quantity reduction using the same ADEME/Shift Project constants as the model. This gives an independently reproducible number that a third-party auditor can verify for CSRD reporting. We acknowledge one limitation: we cannot run a true randomised control trial in a hospital — we cannot tell half the pharmacy team to use Medora and the other half not to. The baseline comparison is the best available method, and it is what the Cour des comptes and CSRD frameworks accept.

---

### Q25. How do you report this for CSRD?

**Short (30s):** Medora's output maps directly to CSRD Scope 3 Category 1 (purchased goods and services). We produce a monthly CSV with CO₂, ecotoxicity, and cost savings per drug, per hospital — ready for import into any CSRD reporting tool.

**Long (2m):** CSRD (Corporate Sustainability Reporting Directive, effective for large French companies from FY 2025) requires companies to report greenhouse gas emissions across three scopes. For hospitals, medicine procurement falls under Scope 3 Category 1: purchased goods and services. The methodology requires a quantity-based or spend-based emission factor — Medora uses the quantity-based approach, which is more accurate. Our CO₂ factors are sourced from ADEME Base Empreinte 2024 and Shift Project 2025, both of which are accepted reference databases under French CSRD implementation guidance. Each month, Medora outputs a report with: quantity avoided per drug, CO₂e avoided (manufacturing + transport + incineration), ecotoxicity score, euros saved — all at ATC code level, which maps to standard GHG accounting categories. This report can be imported into CSRD reporting tools (SWEEP, Greenway, Tennaxia) via CSV. The pharmacist does not need to do additional calculation — the number is ready to copy into the ESG report. This is a feature no competitor currently offers and it is a direct response to the CSRD 2026 deadline.

---

### Q26. Is this greenwashing?

**Short (30s):** No. Every CO₂ number is sourced from ADEME, Shift Project, and Cyclamed. We do not claim avoided emissions we have not measured. We show our methodology in full, including its limitations.

**Long (2m):** Greenwashing is making unsubstantiated or exaggerated environmental claims for marketing purposes. We counter this with four practices. First, every constant in our impact calculator is sourced and documented in `apps/api/ml/impact_constants.py` and `docs/PITCH_NUMBERS.md` — any auditor can trace every number back to a published reference. Second, we show the methodology in the demo UI ("How Medora computed this" section) — the pharmacist and any auditor can see exactly how the CO₂ number was derived. Third, we are honest about uncertainty: the model is trained on synthetic data; real savings will differ. We say this explicitly in the product and in this FAQ. Fourth, the financial saving is the primary claim — the CO₂ saving is a consequence of the same action, not a separate marketing claim layered on top. Reducing over-ordering saves money and reduces CO₂ as a physical consequence of ordering fewer units. We cannot claim the financial saving without the CO₂ saving also being real.

---

## TEAM & EXECUTION

### Q27. You're students or early-career. How do you handle hospital sales?

**Short (30s):** Hospital sales require relationships, not credentials. We get to the first meeting through pharmacy conferences, clinical networks, and the Cour des comptes report as a conversation opener. After that, the product speaks.

**Long (2m):** This is a real challenge and we are honest about it. Enterprise healthcare sales in France is relationship-driven. Our go-to-market for the first 6 months: (1) attend 2–3 hospital pharmacy conferences (SNPHPU in June, SoFHT in October) — these are the watering holes where procurement decision-makers go; (2) use the Cour des comptes 2025 report as a cold outreach opener ("We built a tool that addresses the €1.7B waste the Cour des comptes named last September — can we show you a 30-minute demo?"); (3) reach the first hospital through a warm introduction from our network — a professor, a medical advisor, or a former intern at a CHU. We know this is hard. We also know that the first meeting is the hardest — once a pharmacist director sees the demo live, the conversation changes. If we cannot close a design partner in 6 months of active outreach, we will pivot to a channel partnership with a pharmacy software provider (Pharmagest or Dedalus) who already has relationships with every hospital in France.

---

### Q28. Who's your medical advisor?

**Short (30s):** We do not have a named medical advisor yet. This is a gap we will fill in month 1 — specifically a hospital pharmacist with procurement experience at a CHU, and a healthcare regulatory lawyer familiar with MDR and HDS.

**Long (2m):** We need two types of advisors. First, a clinical advisor: a hospital pharmacist (pharmacien hospitalier) or pharmacy director (pharmacien chef de service) at a large CHU. This person gives us clinical credibility in sales meetings, helps us design the v2 pharmacist workflow, and introduces us to peer contacts at other hospitals. We are identifying candidates through the SNPHPU (Syndicat National des Pharmaciens des Hôpitaux) directory and will make our first ask in the week after this hackathon. Second, a regulatory advisor: a lawyer specialising in HDS/MDR for French medical software. We have identified two firms (Cabinet Houdart, 1dCode) who specialise in this area. The MDR opinion and HDS scoping will be their first engagement. We are willing to offer equity (0.1–0.25%) for a 12-month advisory commitment from the right clinical advisor. This is a gap — but it is a known gap, and we have a plan to fill it.

---

### Q29. What happens if you don't raise?

**Short (30s):** We go slower. The product works today. A design partner relationship needs no capital — just a CSV and our time. We can validate the model on real data with zero funding. The €500k ask is to hire, not to survive.

**Long (2m):** Medora does not require capital to demonstrate value. The marginal cost of running the tool for a design partner hospital is essentially zero — the server costs less than €50/month on Render's free tier. What capital unlocks is: (1) one full-time person focused on hospital BD (€50–70k/year in France); (2) HDS certification (€20–50k one-time); (3) Pharmagest API integration (6 weeks of engineering). If we do not raise €500k pre-seed, we run the design partner validation phase as a side project alongside our current work — it takes 18 months instead of 6. We reach the same destination, just slower. The risk in the no-raise scenario is that a better-capitalised competitor enters the French market while we are moving slowly. This is real but manageable: the first-mover advantage in hospital relationships is strong, and a 6-month head start on a design partnership creates a stickiness that capital alone cannot buy. In short: no raise means slower, not dead.

---

### Q30. What's the hardest problem ahead and how will you solve it?

**Short (30s):** The hardest problem is the first real hospital data integration — getting clean, complete, 24-month procurement data out of a live Pharmagest or Dedalus system. Everything downstream gets easier once we have solved it once.

**Long (2m):** We have identified five hard problems and ranked them. (1) **Real data ingestion** — hospital ERPs export data in proprietary formats with inconsistent column names, encoding issues, missing months, and duplicate entries. Our synthetic data has none of these problems. The first real CSV will break our pipeline in 3–5 places. Solution: we build a robust data cleaning and validation layer in month 1 of the design partner engagement, and we document every edge case. (2) **HDS certification** — a 6–18 month legal and technical process. Solution: start the scoping in month 1, commission the security audit in month 3, target certification by month 12. (3) **First hospital reference** — every subsequent sale is easier once we have one. Solution: design partner agreement with no payment required, maximum value delivered. (4) **Model accuracy on real data** — described in Q10. Solution: build a retraining pipeline and run it automatically every month as new data arrives. (5) **MDR legal opinion** — described in Q13. Solution: commission the written opinion before any production deployment. Of these five, the data ingestion problem is the one that will take the most time and cannot be solved in advance — it requires being inside a real hospital with their real data.
