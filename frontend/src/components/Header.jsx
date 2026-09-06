import React from 'react';
import { Database, Sparkles } from 'lucide-react';

export default function Header({ collections, selectedCollection, onSelectCollection }) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">
          <Sparkles className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Text-to-MQL Dashboard</h1>
          <p className="text-xs text-gray-500">Natural Language MongoDB Query Engine</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
        <Database className="h-4 w-4 text-gray-500" />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Collection:</span>
        <select
          value={selectedCollection}
          onChange={(e) => onSelectCollection(e.target.value)}
          className="bg-transparent text-gray-800 text-sm font-medium focus:outline-none cursor-pointer"
        >
          {collections.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>
    </header>
  );
}