import React from 'react';
import { Database, Loader2 } from 'lucide-react';

export default function SchemaExplorer({ schema, loading }) {
  return (
    <aside className="col-span-3 bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col h-fit">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-emerald-600" /> Schema Explorer
        </h2>
        {schema && (
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            {Object.keys(schema).length} fields
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
          <Loader2 className="animate-spin w-4 h-4 text-emerald-600" /> Fetching schema...
        </div>
      ) : schema ? (
        <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
          {Object.entries(schema).map(([field, meta]) => (
            <div key={field} className="bg-gray-50 border border-gray-200 p-3 rounded-lg hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                <span className="font-mono">{field}</span>
                <span className="text-[10px] bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-mono uppercase">{meta.type}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate font-mono">
                <span className="text-gray-400">ex:</span> {meta.example}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 py-4">No collection selected.</p>
      )}
    </aside>
  );
}