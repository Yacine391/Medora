# Medora API

## Run

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Health check: `GET http://localhost:8000/api/health`
