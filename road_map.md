# Medora — Road Map

## PROJECT SNAPSHOT
- **Name:** Medora
- **Problem:** Hospitals over-order medicines "just in case" → massive waste (7675 tons/year France, €1.7B/year, 1Mt CO2e)
- **Solution:** AI web app that computes the OPTIMAL order quantity from hospital historical data

## STACK
| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui + Recharts |
| Backend | FastAPI + Python 3.11 + Pandas + scikit-learn + Prophet |
| Data | SQLite (dev) / Postgres (prod) |
| Deploy | Netlify (front) + Render or Railway (back) |
| Package mgr | pnpm (front), uv or pip (back) |

## PIPELINE CHECKLIST
- [x] P0 - Bootstrap + docs (THIS PROMPT)
- [x] P1 - Monorepo setup (apps/web + apps/api)
- [x] P2 - Landing page responsive
- [ ] P3 - Datasets + synthetic data generator
- [ ] P4 - AI forecasting engine
- [ ] P5 - Impact calculator (CO2 + ecotox + €)
- [ ] P6 - Demo dashboard (upload + results)
- [ ] P7 - Visualizations + before/after comparison
- [ ] P8 - Mobile responsive polish
- [ ] P9 - Deployment + README + demo script

## RESUME PROTOCOL
When resuming work on Medora, ALWAYS start by:
1. Reading road_map.md fully
2. Reading ARCHITECTURE.md fully
3. Identifying the last [~] or first [ ] in PIPELINE CHECKLIST
4. Continuing from there. Never restart from P0.

## CURRENT STATE
- **Last completed step:** P2
- **Next step:** P3
- **Known issues:** none
- **Files created this session:** apps/web/src/app/page.tsx (full landing page — Hero, Problem, How it Works, Impact, CTA, Footer)
