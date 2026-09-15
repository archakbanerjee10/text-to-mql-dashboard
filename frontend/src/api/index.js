import axios from 'axios'

const API_BASE = "https://text-to-mql-dashboard-1.onrender.com/api/v1";
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

