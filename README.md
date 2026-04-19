# 🏥 Medora

> AI that prevents medicine over-ordering in hospitals. €1.7B wasted every year in France. We cut this at the source.

![status](https://img.shields.io/badge/status-hackathon_demo-brightgreen)
![stack](https://img.shields.io/badge/stack-Next.js_FastAPI_LightGBM-blue)
![compliance](https://img.shields.io/badge/compliance-HDS_RGPD_ready-slate)

## 🎯 The problem

Hospitals over-order medicines "just in case". Result:

- **7,675 tons** of medicines thrown away in France in 2024 *(Cyclamed)*
- **€1.7 billion** wasted every year *(Cour des comptes 2025)*
- **1 million tons CO₂e** emitted for nothing *(Shift Project 2025)*

## 💡 Our solution

An on-premise AI that analyses 24+ months of each hospital's data and computes the exact order quantity — with confidence intervals and full explainability (SHAP).

## 🏗️ Architecture

| Layer | Tech |
|---|---|
| **Frontend** | Next.js 14 · TypeScript · Tailwind · shadcn/ui · Recharts |
| **Backend** | FastAPI · Python 3.11 · LightGBM · SHAP · Pandas |
| **ML model** | LightGBM global model — 30 features, zero external API calls |
| **Deployment** | Vercel (web) + Render (api) — or fully on-prem for real hospitals |
| **Data residency** | No patient data ever leaves the hospital. No external LLM calls. |

## 🚀 Run locally (5 minutes)

```bash
# 1. Backend
cd apps/api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python data/generate_synthetic.py
uvicorn main:app --reload --port 8000

# 2. Frontend (new terminal)
cd apps/web
cp .env.example .env.local
pnpm install
pnpm dev
```

Open http://localhost:3000 → click **Try the demo**.

## 📊 Try the live demo

- **Web:** https://medora.vercel.app *(update after deploy)*
- **Recommended scenario:** Select "HP Cantal — 80 beds · rural" + 12 months → Run analysis
- The AI recommends ~18% fewer orders, with CO₂ and cost savings broken down per drug

## 🔒 Compliance

- **HDS** (Hébergement de Données de Santé, France) — required for hospital deployments
- **RGPD** — Article 9 (health data), Article 32 (security)
- **No external APIs for predictions** — LightGBM runs 100% locally
- Ships as a Docker container, deploys next to your pharmacy software

## 📖 Data sources

- Shift Project — *Décarbonons les Industries de Santé* (2025)
- Cyclamed — *Rapport annuel* (2024)
- Cour des comptes — *Rapport sur les médicaments hospitaliers* (sept. 2025)
- ADEME Base Empreinte (2024)
- WHO ATC/DDD classification

## 🧪 Running tests

```bash
cd apps/api
source .venv/bin/activate
pytest tests/ -v
```

## 🚢 Deploy

See [`DEPLOY.md`](DEPLOY.md) for step-by-step Render + Vercel instructions.

## 📁 Docs (for the jury)

| File | Content |
|---|---|
| [`docs/PITCH_NUMBERS.md`](docs/PITCH_NUMBERS.md) | Every number we use, with its source |
| [`docs/ARCHITECTURE_DECISIONS.md`](docs/ARCHITECTURE_DECISIONS.md) | 5 key trade-offs and why |
| [`docs/ROADMAP_POST_HACKATHON.md`](docs/ROADMAP_POST_HACKATHON.md) | 6/12/24-month roadmap |
| [`docs/PITCH_DECK.md`](docs/PITCH_DECK.md) | 12-slide pitch outline |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Full technical architecture |

## 👥 Team

- [Name 1] — [role]
- [Name 2] — [role]
- [Name 3] — [role]

Built for MIT Hackathon · 2026

## 📄 License

MIT
