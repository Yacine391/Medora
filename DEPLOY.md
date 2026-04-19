# Medora — Deployment Guide

## Step-by-step (15 minutes)

### 1 · Push latest code

```bash
git add .
git commit -m "deploy"
git push origin main
```

### 2 · Backend — Render

1. Create a free account at https://render.com
2. **New → Web Service** → connect your GitHub repo
3. Settings:
   - **Root Directory:** `apps/api`
   - **Build Command:** `pip install -r requirements.txt && python data/generate_synthetic.py`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Region:** Frankfurt (closest to France)
   - **Plan:** Free
4. Add environment variable: `PYTHON_VERSION = 3.11.9`
5. Click **Deploy**. Wait ~3 minutes.
6. Copy your Render URL (e.g. `https://medora-api.onrender.com`)
7. Verify: `curl https://medora-api.onrender.com/api/health` → `{"status":"ok"}`

> **Free tier note:** Render spins down after 15 min idle. The first request after sleep takes ~30s. The demo page shows a "Waking up…" banner automatically.

### 3 · Frontend — Vercel

1. Create a free account at https://vercel.com
2. **New Project** → Import your GitHub repo
3. **Framework:** Next.js (auto-detected)
4. **Root Directory:** `apps/web`
5. Add environment variable:
   - Name: `NEXT_PUBLIC_API_BASE_URL`
   - Value: your Render URL (e.g. `https://medora-api.onrender.com`)
   - Scope: Production
6. Click **Deploy**. Wait ~2 minutes.

> If already deployed: go to **Project → Settings → Environment Variables**, add/update `NEXT_PUBLIC_API_BASE_URL`, then **Deployments → Redeploy**.

### 4 · Update CORS (if using a custom Vercel domain)

Set the `FRONTEND_URL` environment variable in Render to your Vercel URL:

```
FRONTEND_URL=https://your-project.vercel.app
```

### 5 · Smoke test

1. Open your Vercel URL
2. Go to **/demo**
3. Select "HP Cantal" (rural, 80 beds) + 12 months → **Run analysis**
4. Verify results appear (KPI strip + 3 charts + per-drug table)
5. Open DevTools → Network → confirm calls go to your Render URL

### 6 · Share with the jury

Send the Vercel URL. Done.
