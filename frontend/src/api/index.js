import axios from 'axios'

const API_BASE = (
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api/v1"
).replace(/\/$/, "")

export const fetchCollections = async () => {
    const res = await axios.get(`${API_BASE}/sample-collection`);
    return res.data.collections || [];
};

export const fetchSchema = async (collectionName) => {
    const res = await axios.get(`${API_BASE}/collections/${collectionName}/schema`);
    return res.data;
};

export const generatePipeline = async (collectionName, userPrompt) => {
    const res = await axios.post(`${API_BASE}/querry/generate`, {
      collection_name: collectionName,
      user_prompt: userPrompt,
    });
    return res.data;
};

export const executePipeline = async (collectionName, pipeline) => {
    const res = await axios.post(`${API_BASE}/pipeline/execute`, {
      collection_name: collectionName,
      pipeline: pipeline,
    });
    return res.data;
};

