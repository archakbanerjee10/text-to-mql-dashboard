# Text-to-MQL Dashboard

A React + FastAPI app that turns natural-language questions into MongoDB aggregation pipelines (MQL), runs them against your database, and shows the results as charts or JSON.

Ask something like *“Show total revenue grouped by category”*, inspect the generated pipeline, then execute it and visualize the output.

## Features

- **Natural language → MQL** — Gemini converts a question into a MongoDB aggregation pipeline using a sampled collection schema
- **Schema explorer** — browse inferred field names and types for the selected collection
- **Pipeline editor** — review or edit the generated JSON before running it
- **Live execution** — run the pipeline against MongoDB (capped at 1,000 documents)
- **Charts + JSON** — bar chart or raw JSON view of query results
- **Safety checks** — write/destructive stages (`$out`, `$merge`, `$indexStats`, `$collStats`) are blocked

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, Axios, Recharts |
| Backend | FastAPI, Uvicorn, Pydantic |
| Database | MongoDB (PyMongo) |
| LLM | Google Gemini (`gemini-3.6-flash`) |

## Project structure

```
project1/
├── backend/
│   ├── app/
│   │   ├── config.py          # MongoDB settings from .env
│   │   ├── database.py        # connection lifecycle
│   │   ├── llm_engine.py      # Gemini → aggregation pipeline
│   │   └── schema_utils.py    # sample documents, infer fields
│   ├── main.py                # API routes
│   ├── seed_db.py             # sample sales data
│   └── .env                   # secrets (not committed)
├── frontend/
│   └── src/                   # dashboard UI
└── README.md
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB running locally (default `mongodb://localhost:27017`)
- A [Google Gemini API key](https://ai.google.dev/)

## Setup

### 1. Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install fastapi uvicorn pymongo python-dotenv pydantic google-genai
```

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=analytics_db
GEMINI_API_KEY=your_gemini_api_key
```

Seed sample e-commerce data (optional, collection `sales`):

```bash
python seed_db.py
```

Start the API:

```bash
uvicorn main:app --reload
```

- API: http://127.0.0.1:8000
- Swagger docs: http://127.0.0.1:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard: http://localhost:5173

Keep both servers running. The UI talks to `http://127.0.0.1:8000/api/v1`.

## How it works

1. The UI loads collection names and infers a schema by sampling a few documents.
2. You type a question and choose a collection.
3. The backend sends the prompt + schema to Gemini and returns a JSON aggregation pipeline.
4. Prohibited stages are rejected.
5. The pipeline is executed with an extra `$limit: 1000` stage.
6. Results appear as a bar chart or raw JSON. You can edit the pipeline and run it again.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/sample-collection` | List collections |
| `GET` | `/api/v1/collections/{name}/schema` | Infer schema from sample docs |
| `POST` | `/api/v1/querry/generate` | Generate a pipeline from a prompt |
| `POST` | `/api/v1/pipeline/execute` | Run a pipeline and return records |

Generate body:

```json
{
  "collection_name": "sales",
  "user_prompt": "Show total revenue grouped by category"
}
```

Execute body:

```json
{
  "collection_name": "sales",
  "pipeline": [
    { "$group": { "_id": "$category", "total": { "$sum": { "$multiply": ["$price", "$quantity"] } } } }
  ]
}
```

## Example prompts

- Show total revenue grouped by category
- Count orders by status
- List electronics products priced above 50
- Average quantity sold per product

## Notes

- Do not commit `.env`. It is gitignored.
- CORS is allowed from `http://localhost:5173` and `http://127.0.0.1:5173`.
- MongoDB must be running before you start the backend.

## License

Use this project for learning and demos. Add a license file if you want to publish it under specific terms.
