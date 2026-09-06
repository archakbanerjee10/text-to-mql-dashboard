import json
import os
from google import genai
from google.genai import types
from typing import List, Dict, Any

# 1. Initialize Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

PROHIBITED_STAGES = {"$out", "$merge", "$indexStats", "$collStats"}

def generate_mongodb_pipeline(user_prompt: str, schema_info: Dict[str, Any]) -> List[Dict[str, Any]]:
    target_collection = schema_info.get("collection", "unknown")
    fields_json = json.dumps(schema_info.get("fields", {}), indent=2)

    system_prompt = (
        f"You are an expert MongoDB Data Engineer. Convert a natural language request into a valid MongoDB Aggregation Pipeline.\n\n"
        f"Target Collection: {target_collection}\n"
        f"Collection Schema & Data Types:\n{fields_json}\n\n"
        f"Rules:\n"
        f"1. Return ONLY a valid JSON array of MongoDB aggregation pipeline stages (e.g., [{{\"$match\": ...}}, {{\"$group\": ...}}]).\n"
        f"2. Do NOT wrap the JSON in markdown code blocks. Return raw JSON text only.\n"
        f"3. Do NOT include write/destructive operations ($out, $merge). Only use read/query stages.\n"
        f"4. Ensure key names match the schema provided.\n"
    )

    # 2. Use client.models.generate_content (NOT client.chat)
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=f"{system_prompt}\n\nUser Request: {user_prompt}",
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.0
        ),
    )

    raw_output = response.text.strip()

    try:
        pipeline = json.loads(raw_output)
    except json.JSONDecodeError:
        raise ValueError("LLM generated invalid JSON structure.")

    if not isinstance(pipeline, list):
        raise ValueError("Generated MongoDB pipeline must be a JSON array.")

    for stage in pipeline:
        for key in stage.keys():
            if key in PROHIBITED_STAGES:
                raise ValueError(f"Security Alert: Prohibited stage '{key}' detected.")

    return pipeline