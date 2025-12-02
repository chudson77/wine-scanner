import React, { useState } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { WineCard } from './components/WineCard';
import { ReviewList } from './components/ReviewList';
import { identifyWineWithGemini } from './services/wineService';
import { Wine, Loader2, Key, List, Camera } from 'lucide-react';

function App() {
  const [status, setStatus] = useState('idle'); // idle, analyzing, success, error
  const [wineData, setWineData] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(true);
  const [view, setView] = useState('scan'); // 'scan' or 'reviews'

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-wine-50 dark:from-gray-900 dark:to-wine-950 text-gray-900 dark:text-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex flex-col flex-grow">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-wine-700 dark:text-wine-300 mb-2">
            SommelierAI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Identify your wine with a snap!
          </p>

          {showKeyInput && (
            <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-top-4 mb-6">
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
              <p className="mt-2 text-xs text-center text-gray-400">
                Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-wine-600 hover:underline">Google AI Studio</a>
              </p>
            </div>
          )}

          {/* Navigation Toggle */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setView('scan')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${view === 'scan'
                  ? 'bg-wine-600 text-white shadow-lg shadow-wine-600/20'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <Camera className="w-4 h-4" />
              Scan
            </button>
            <button
              onClick={() => setView('reviews')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${view === 'reviews'
                  ? 'bg-wine-600 text-white shadow-lg shadow-wine-600/20'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <List className="w-4 h-4" />
              My Reviews
            </button>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center min-h-[50vh]">
          {view === 'reviews' ? (
            <div className="w-full max-w-md mx-auto">
              <ReviewList />
            </div>
          ) : (
            <>
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
            </>
          )}
        </main>


        <footer className="mt-auto py-8 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>© 2025 SommelierAI. Powered by Google Gemini.</p>
        </footer>
      </div >
    </div >
  );
}

export default App;
