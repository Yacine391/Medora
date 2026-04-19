# Medora — 3-Minute Demo Script

Total time: 180 seconds. Three presenters. One live demo.

---

## Script

| Time | Action on screen | Narration (spoken) |
|---|---|---|
| 0:00–0:15 | Landing page visible. Headline: **"Hospitals order 20% too much. We fix that."** | "In France, hospitals throw away 7,675 tons of medicines every year. 1.7 billion euros burned. And it starts at the simplest decision: how much to order." |
| 0:15–0:30 | Scroll down slowly to the 3 stat cards: €1.7B, 7,675 t, 1Mt CO₂e | "These drugs are manufactured in Asia, shipped 10,000 km, sometimes refrigerated — and never touched by a patient. Every box contains energy, transport, and pollution that served nothing." |
| 0:30–0:45 | Click **Try the demo** button. Demo page loads. | "So we built Medora. An AI that learns from each hospital's own data and tells them exactly how much to order next month." |
| 0:45–0:55 | Select **HOSP_003 — HP Cantal, 80 beds · rural**. Select **12 months** horizon. Click **Run analysis**. Loading skeleton appears. | "Notice — this AI runs locally. No patient data ever leaves this hospital's infrastructure. It's HDS and RGPD ready from day one." |
| 0:55–1:15 | Results appear. Point to the 4 KPI cards one by one. | "For this one rural hospital, over 12 months: 3,000+ units avoided, €48k saved, 12,000 kg CO₂ not emitted. That's 12 tons — equivalent to 80,000 km driven by car." |
| 1:15–1:30 | Scroll to charts. Point to the before/after bar chart, then the pie chart. | "This bar chart shows what the hospital orders today versus what Medora recommends. Every grey bar above the green is waste. The pie chart shows where CO₂ comes from — mostly manufacturing, because producing an API in India emits 65 kg CO₂ per kilogram. 105 times more CO₂ than making cement." |
| 1:30–1:50 | Click **How Medora computed this** accordion. It expands. Then scroll to the per-drug table. Hover over a reduction badge. | "We use LightGBM with SHAP explainability. For every recommendation, the pharmacist sees the top 3 drivers. No black box — just the data. This drug had a 14% waste rate over 6 months. The AI reduced the next order by 18%. The pharmacist can accept, override, or ask for more context." |
| 1:50–2:00 | Hover over one **Top driver** cell in the table to show the SHAP tooltip. | "Here — 'seasonal demand drop in summer −15%'. This is why. Explainable. Auditable. Actionable." |
| 2:00–2:30 | Close demo tab or switch to slide. Show a simple text slide or return to landing page. | "Now multiply this one hospital by 3,000 hospitals in France. Then by 15,000 in Europe. The Cour des comptes estimates 224 to 867 million euros per year can be saved immediately. Medora is the instrument for that." |
| 2:30–2:50 | Stay on slide or blank screen. Presenter faces jury. | "Our model is SaaS per bed per month — or per volume of orders, we let the hospital choose. Cost: less than 0.5% of their medicines budget. ROI in under 3 months. We are looking for 3 design partners in French CHUs and €500k pre-seed to reach them." |
| 2:50–3:00 | No screen action. Direct eye contact. | "Medora. We don't tell doctors what to prescribe. We just stop the waste before it's ordered. Thank you." |

---

## Presenter assignment

- **Presenter 1** (0:00–0:45 — problem + transition): [Name]
- **Presenter 2** (0:45–2:00 — live demo + explainability): [Name]
- **Presenter 3** (2:00–3:00 — scale + business + ask): [Name]

---

## Live demo safety checklist

- [ ] Laptop fully charged + charger plugged in and nearby
- [ ] Local API running: `cd apps/api && source .venv/bin/activate && uvicorn main:app --reload --port 8000` (start 10 min before)
- [ ] Frontend running: `cd apps/web && pnpm dev` (start 10 min before)
- [ ] Vercel URL open in a browser tab as backup
- [ ] Phone with mobile hotspot ready (venue WiFi is unreliable)
- [ ] Browser zoom at 100% — no dev tools open
- [ ] Dark mode **off** (projectors wash out dark backgrounds)
- [ ] Run one full analysis right before going on stage — warms the cache and confirms the API is responding
- [ ] Know the exact numbers HOSP_003 + 12 months returns, in case you need to narrate without screen

---

## Plan B if demo fails live

Switch immediately to the pre-recorded screencast (see `docs/DEMO_RECORDING.md`).

Say: *"Let me show you a recorded walkthrough — we'll go deeper on any slide in Q&A."*

Do not apologise for more than 5 seconds. Move forward. Juries remember confidence, not technical failures.
