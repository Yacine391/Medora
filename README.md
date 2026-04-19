# Medora

AI web app that computes the optimal medicine order quantity from hospital historical data, cutting pharmaceutical waste (7 675 tons/year in France, €1.7B, 1Mt CO2e).

## Run

**Frontend** (http://localhost:3000)
```bash
cd apps/web
pnpm install
pnpm dev
```

**Backend** (http://localhost:8000)
```bash
cd apps/api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
