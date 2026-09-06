import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { fetchCollections, fetchSchema, generatePipeline, executePipeline } from './api/index';

import Header from './components/Header';
import SchemaExplorer from './components/SchemaExplorer';
import PipelineEditor from './components/PipelineEditor';
import ResultsVisualizer from './components/ResultsVisualizer';

export default function App() {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [schema, setSchema] = useState(null);
  const [prompt, setPrompt] = useState('');
  
  const [pipelineText, setPipelineText] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [loadingGen, setLoadingGen] = useState(false);
  const [loadingExec, setLoadingExec] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCollections()
      .then((cols) => {
        setCollections(cols);
        if (cols.length > 0) setSelectedCollection(cols[0]);
      })
      .catch((err) => setError('Failed to connect to backend: ' + err.message));
  }, []);

  useEffect(() => {
    if (!selectedCollection) return;
    setLoadingSchema(true);
    fetchSchema(selectedCollection)
      .then((data) => setSchema(data.fields))
      .catch((err) => setError('Failed to load schema: ' + err.message))
      .finally(() => setLoadingSchema(false));
  }, [selectedCollection]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setError(null);
    setLoadingGen(true);
    setQueryResults(null);

    try {
      const res = await generatePipeline(selectedCollection, prompt);
      const formattedJson = JSON.stringify(res.generated_pipeline, null, 2);
      setPipelineText(formattedJson);
      handleExecute(formattedJson);
    } catch (err) {
      setError(err.response?.data?.detail || 'Pipeline generation failed.');
    } finally {
      setLoadingGen(false);
    }
  };

  const handleExecute = async (overridePipelineText = null) => {
    setError(null);
    setLoadingExec(true);

    try {
      const parsedPipeline = JSON.parse(overridePipelineText || pipelineText);
      const res = await executePipeline(selectedCollection, parsedPipeline);
      setQueryResults(res.data);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format in pipeline editor.');
      } else {
        setError(err.response?.data?.detail || 'Query execution failed.');
      }
    } finally {
      setLoadingExec(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans antialiased">
      <Header 
        collections={collections} 
        selectedCollection={selectedCollection} 
        onSelectCollection={setSelectedCollection} 
      />

      <div className="flex-1 grid grid-cols-12 gap-8 p-8 max-w-[1600px] w-full mx-auto">
        <SchemaExplorer schema={schema} loading={loadingSchema} />

        <main className="col-span-9 space-y-6 flex flex-col">
          <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <form onSubmit={handleGenerate} className="flex gap-3">
              <input
                type="text"
                placeholder="Ask a question about your data (e.g. 'Show total revenue grouped by category')..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
              <button
                type="submit"
                disabled={loadingGen}
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-gray-100 disabled:text-gray-400 text-white font-medium text-sm px-6 py-2.5 rounded-lg flex items-center gap-2 transition shadow-sm"
              >
                {loadingGen ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                Generate
              </button>
            </form>
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 flex-1">
            <PipelineEditor 
              pipelineText={pipelineText} 
              setPipelineText={setPipelineText} 
              onExecute={handleExecute} 
              loadingExec={loadingExec} 
            />
            <ResultsVisualizer 
              queryResults={queryResults} 
              loadingExec={loadingExec} 
            />
          </div>
        </main>
      </div>
    </div>
  );
}