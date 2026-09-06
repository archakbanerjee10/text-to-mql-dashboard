import React, { useState } from 'react';
import { BarChart3, Table as TableIcon, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ResultsVisualizer({ queryResults, loadingExec }) {
  const [activeTab, setActiveTab] = useState('chart');

  const dataKeys = queryResults && queryResults.length > 0 ? Object.keys(queryResults[0]) : [];
  const xAxisKey = dataKeys.find(k => k !== '_id' && typeof queryResults[0][k] === 'string') || dataKeys[0];
  const numericKey = dataKeys.find(k => k !== '_id' && typeof queryResults[0][k] === 'number') || dataKeys[1];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Data View</span>
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${activeTab === 'chart' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" /> Chart
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${activeTab === 'raw' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <TableIcon className="w-3.5 h-3.5 text-emerald-600" /> Raw JSON
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[340px]">
        {loadingExec ? (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Loader2 className="animate-spin w-5 h-5 text-emerald-600" /> Querying MongoDB...
          </div>
        ) : queryResults && queryResults.length > 0 ? (
          activeTab === 'chart' ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={queryResults} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#059669', fontWeight: 600, fontSize: '12px' }}
                />
                <Bar dataKey={numericKey} fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <pre className="w-full h-full max-h-[320px] overflow-auto bg-gray-50 border border-gray-200 p-4 rounded-lg font-mono text-xs text-gray-700">
              {JSON.stringify(queryResults, null, 2)}
            </pre>
          )
        ) : (
          <div className="text-center py-8">
            <p className="text-xs font-medium text-gray-400">No output generated yet.</p>
            <p className="text-[11px] text-gray-300 mt-1">Submit a query prompt above to inspect visual results.</p>
          </div>
        )}
      </div>
    </div>
  );
}