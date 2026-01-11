import React, { useState, useEffect } from 'react';
import { Layers, Trash2, History } from 'lucide-react';
import { CVSSCalculator } from './components/CVSSCalculator';
import { VRLCalculator } from './components/VRLCalculator';
import { IPCalculator } from './components/IPCalculator';
import { SavedCalculation } from './types';
import { Button } from './components/UI';

const App: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedCalculation[]>([]);

  // Load from session storage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('fincalc_history');
    if (saved) {
      try {
        setSavedItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse session history", e);
      }
    }
  }, []);

  // Save to session storage whenever state changes
  useEffect(() => {
    sessionStorage.setItem('fincalc_history', JSON.stringify(savedItems));
  }, [savedItems]);

  const addToSession = (item: Omit<SavedCalculation, 'id' | 'timestamp'>) => {
    const newItem: SavedCalculation = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    setSavedItems(prev => [newItem, ...prev]);
  };

  const clearSession = () => {
    if (window.confirm("Are you sure you want to clear all saved calculations?")) {
      setSavedItems([]);
    }
  };

  const deleteItem = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              FinCalc Pro
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Financial Suite v1.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <CVSSCalculator onSave={addToSession} />
          <VRLCalculator onSave={addToSession} />
          <IPCalculator onSave={addToSession} />
        </div>

        {/* Saved Session History */}
        <div className="mt-8 border-t border-slate-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <History className="w-6 h-6 text-slate-400" />
              Session History
            </h2>
            {savedItems.length > 0 && (
              <Button variant="danger" onClick={clearSession} className="text-xs sm:text-sm">
                <Trash2 className="w-4 h-4 mr-2" /> Clear History
              </Button>
            )}
          </div>

          {savedItems.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              <p>No calculations saved in this session yet.</p>
              <p className="text-sm mt-1">Use the "Save" button on any calculator to add items here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {savedItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-indigo-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        item.type === 'CVSS' ? 'bg-blue-100 text-blue-700' :
                        item.type === 'VRL' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-800">{item.title}</div>
                    <div className="text-sm text-slate-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      {Object.entries(item.inputs).map(([key, value]) => (
                        <span key={key} className="whitespace-nowrap">
                          {key}: <span className="font-medium text-slate-700">{value}</span>
                        </span>
                      ))}
                    </div>
                    {item.message && (
                      <div className={`text-sm mt-1 font-medium ${item.message.includes('Safe') ? 'text-green-600' : 'text-amber-600'}`}>
                        Note: {item.message}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 uppercase">Result</div>
                      <div className="text-xl font-bold text-indigo-600">
                        {item.type === 'VRL' || item.type === 'IP' ? `${item.result.toFixed(2)}%` : item.result.toFixed(2)}
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} FinCalc Pro. All calculations are stored locally in your session.
        </div>
      </footer>
    </div>
  );
};

export default App;
