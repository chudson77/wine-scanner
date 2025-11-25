import React, { useState } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { WineCard } from './components/WineCard';
import { identifyWineWithGemini } from './services/wineService';
import { Wine, Loader2, Key } from 'lucide-react';

function App() {
  const [status, setStatus] = useState('idle'); // idle, analyzing, success, error
  const [wineData, setWineData] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(true);

  const handleCapture = async (file) => {
    if (!apiKey) {
      alert("Please enter a valid Google Gemini API Key first.");
      return;
    }

    setStatus('analyzing');
    try {
      const data = await identifyWineWithGemini(file, apiKey);
      setWineData(data);
      setStatus('success');
    } catch (error) {
      console.error('Error identifying wine:', error);
      setWineData({ error: error.message || "Unknown error occurred" });
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setWineData(null);
  };

  const handleListModels = async () => {
    if (!apiKey) {
      alert("Enter API Key first");
      return;
    }
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await response.json();
      if (data.error) {
        alert(`Error: ${data.error.message}`);
        return;
      }
      const modelNames = data.models?.map(m => m.name) || [];
      alert("Available Models:\n" + modelNames.join("\n"));
      console.log("Available Models:", data.models);
    } catch (e) {
      alert("Failed to list models: " + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col items-center justify-center gap-6 mb-12 pt-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-wine-600 rounded-2xl shadow-lg shadow-wine-600/20">
              <Wine className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Sommelier<span className="text-wine-600">AI</span>
            </h1>
          </div>

          {showKeyInput && (
            <div className="w-full max-w-md animate-in fade-in slide-in-from-top-4">
              <div className="relative flex items-center">
                <Key className="absolute left-3 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter Google Gemini API Key"
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-wine-500 transition-all"
                />
              </div>
              <div className="flex justify-between items-center mt-2 px-1">
                <p className="text-xs text-gray-400">
                  Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-wine-600 hover:underline">Google AI Studio</a>
                </p>
                <button onClick={handleListModels} className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 underline">
                  Debug: List Models
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="flex flex-col items-center justify-center min-h-[60vh]">
          {status === 'idle' && (
            <div className="w-full animate-in fade-in zoom-in duration-500">
              <CameraCapture onCapture={handleCapture} />
            </div>
          )}

          {status === 'analyzing' && (
            <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-wine-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wine className="w-6 h-6 text-wine-600 animate-pulse" />
                </div>
              </div>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
                Asking the Sommelier...
              </p>
            </div>
          )}

          {status === 'success' && wineData && (
            <WineCard wine={wineData} onReset={handleReset} />
          )}

          {status === 'error' && (
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl max-w-md mx-auto overflow-hidden">
                <p className="font-medium mb-2">Could not identify wine.</p>
                <p className="text-xs font-mono bg-red-100 dark:bg-red-950/50 p-2 rounded text-left break-all">
                  {wineData?.error || "Check your API Key and try again."}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          )}
        </main>

        <footer className="mt-auto py-8 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>© 2025 SommelierAI. Powered by Google Gemini.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
