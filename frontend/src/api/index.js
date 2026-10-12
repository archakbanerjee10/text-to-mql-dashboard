import axios from 'axios'

const API_BASE = (
  "https://text-to-mql.onrender.com"
).replace(/\/$/, "")

export const fetchCollections = async () => {
  const res = await fetch(`${API_BASE}/api/v1/sample-collection`);
  
  // Check if the request was successful
  if (!res.ok) {
      throw new Error("Failed to fetch collections");
  }
  
  const data = await res.json();
  return data.collections || [];
};

export const fetchSchema = async (collectionName) => {
  const res = await fetch(`${API_BASE}/api/v1/collections/${collectionName}/schema`);
  
  if (!res.ok) {
      throw new Error("Failed to load schema");
  }
  
  const data = await res.json();
  return data;
};

export const generatePipeline = async (collectionName, userPrompt) => {
    const res = await axios.post(`${API_BASE}/querry/generate`, {
      collection_name: collectionName,
      user_prompt: userPrompt,
    });git 
    return res.data;
};

export const executePipeline = async (collectionName, pipeline) => {
    const res = await axios.post(`${API_BASE}/pipeline/execute`, {
      collection_name: collectionName,
      pipeline: pipeline,
    });
    return res.data;
};

