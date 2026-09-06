import React from 'react';
import { Code2, Play, Loader2 } from 'lucide-react';

export default function PipelineEditor({ pipelineText, setPipelineText, onExecute, loadingExec }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-600" /> Pipeline Editor
        </span>
        <button
          onClick={() => onExecute()}
          disabled={loadingExec || !pipelineText}
          className="text-xs bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loadingExec ? <Loader2 className="animate-spin w-3 h-3" /> : <Play className="w-3 h-3 fill-emerald-700" />} Run Pipeline
        </button>
      </div>
      <textarea
        value={pipelineText}
        onChange={(e) => setPipelineText(e.target.value)}
        placeholder="// Generated MQL query will appear here..."
        className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-lg p-3.5 font-mono text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none min-h-[340px]"
      />
    </div>
  );
}