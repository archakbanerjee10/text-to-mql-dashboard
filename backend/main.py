from fastapi import FastAPI, Depends, HTTPException, status
from pymongo.database import Database
from app.database import lifespan, get_db
from app.config import settings
from app.schema_utils import sample_collection_schema
from pydantic import BaseModel
from app.llm_engine import generate_mongodb_pipeline
from typing import List, Dict, Any

from fastapi.middleware.cors import CORSMiddleware

#Input data models 
class QueryRequest(BaseModel):
    collection_name: str
    user_prompt: str

class ExecutionPipelineRequest(BaseModel):
    collection_name: str
    pipeline : List[Dict[str, Any]]
#initializing the fast api app

app= FastAPI(
    title="Smart text to tool BI engine",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}
#setting up methods

@app.get("/api/v1/sample-collection")
def list_collections(db:Database=Depends(get_db)):
    """Fetch all the available collections from the databse."""
    try:
        collections = db.list_collection_names()
        return {"collections": collections}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/api/v1/collections/{collection_name}/schema")
def get_schema(collection_name:str, db:Database=Depends(get_db)):
    """Inspect and return sample schema structure for a given collection"""
    try:
        schema_data = sample_collection_schema(db, collection_name)
        return schema_data
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.post("/api/v1/querry/generate")
def generate_query(payload:QueryRequest, db:Database=Depends(get_db)):
    """converts users natural languggae question into MongoDB pipeline via LLM"""
    try:
        #fetch the sample schema for the target collection
        schema_info = sample_collection_schema(db, payload.collection_name)

        #pass prompt and schema to LLM engine to get MongoDB pipeline
        pipeline = generate_mongodb_pipeline(payload.user_prompt, schema_info)

        return {
            "status": "success",
            "prompt": payload.user_prompt,
            "generated_pipeline": pipeline
        }
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@app.post("/api/v1/pipeline/execute")
def execute_query(payload:ExecutionPipelineRequest, db:Database=Depends(get_db)):
    """Safely execute generated MongoDB pipeline and return data records """
    try:
        collection = db[payload.collection_name]

        #Guardrail to limit maximum return records to prevent memory crashes 
        execution_pipeline = payload.pipeline + [{"$limit": 1000}]

        results = list(collection.aggregate(execution_pipeline))

        #convert BSON object ids to string so JSON can serialize them clearly
        for doc in results:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])

        return {
            "status": "success",
            "record_count": len(results),
            "data": results
        }

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))