# Medora — Demo Recording Guide

A backup screen capture in case of live demo failure. Record this before the event.

---

## Tools

| OS | Tool | Notes |
|---|---|---|
| macOS | `Cmd + Shift + 5` | Built-in. Select "Record Selected Portion". |
| Windows | `Win + G` | Xbox Game Bar. Click record. |
| Any | OBS Studio (free) | Best quality. Download at obsproject.com |

---

## Settings

- **Resolution:** 1920×1080 (full HD)
- **Frame rate:** 30 fps
- **Audio:** record your voice narrating (use the demo script)
- **Duration:** aim for 2 minutes (tight version — cut the accordion section)

---

## Before you record

1. Start the local API: `cd apps/api && source .venv/bin/activate && uvicorn main:app --port 8000`
2. Start the frontend: `cd apps/web && pnpm dev`
3. Run one warm-up analysis (HOSP_003, 12 months) to cache the result
4. Set browser zoom to 100%
5. Turn off notifications (macOS: Focus mode. Windows: Do Not Disturb)
6. Close all other tabs

---

## What to record (2-minute version)

| Time | Action |
|---|---|
| 0:00–0:10 | Show landing page headline. Scroll to stat cards. |
| 0:10–0:20 | Click "Try the demo". Demo page loads. |
| 0:20–0:45 | Select HOSP_003 + 12 months. Click Run. Wait for results. |
| 0:45–1:15 | Walk through KPI cards and two charts. |
| 1:15–1:40 | Scroll to per-drug table. Hover one tooltip. |
| 1:40–2:00 | Close with verbal summary: numbers, business model, ask. |

---

## After recording

1. Record in **one take** — no edits. Juries appreciate authenticity.
2. Upload to **YouTube (unlisted)** — keep the link private, share only with the team.
3. Download the MP4 locally.
4. Place the MP4 at `docs/demo_backup.mp4`.
   - If the file is large (>50 MB): add it to `.gitignore` and store the YouTube URL in this file instead.
   - YouTube URL: *(fill in after upload)*

---

## On the day

If the live demo breaks, open the YouTube link or the local MP4 in full screen. Start narrating live over the video — do not go silent.
