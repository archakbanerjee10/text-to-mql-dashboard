#defining the schema of our no sql

from typing import Dict,Any
from pymongo.database import Database

def sample_collection_schema(db:Database,collection_name:str,sample_size:int=5) -> Dict[str, Any]:
    """
    Samples documents from a collection to infer field names and data types.
    This schema is fed into the LLM prompt.
    """
    if collection_name not in db.list_collection_names():
        raise ValueError(f"Collection {collection_name} does not exist")

    collection = db[collection_name]
    sample_docs=list(collection.find().limit(sample_size))

    if not sample_docs:
        return {"collections":collection_name,"fields":{},"sample_count":0}

    fields_schema={}

    for doc in sample_docs:
        for key,value in doc.items():
            if key=="_id":
                continue # Exclude MongoDB ObjectIDs from LLM schema prompt

            field_type=type(value).__name__

            if key not in fields_schema:
                fields_schema[key] = {
                    "type":field_type,
                    "example":str(value)[:50] #truncate long values that are not required
                }

    return{
        "collection":collection_name,
        "fields":fields_schema,
        "sample_count":len(sample_docs)
    }
