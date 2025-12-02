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

  // Load API key from storage on mount
  React.useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setShowKeyInput(false);
    }
  }, []);

  const handleSaveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    if (key) setShowKeyInput(false);
  };

  const handleDisconnectKey = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
    setShowKeyInput(true);
    setWineData(null);
    setStatus('idle');
  };

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
    <div className="min-h-screen bg-[#f7f7f5] dark:bg-stone-900 text-stone-800 dark:text-stone-100 flex flex-col font-sans">
      <div className="container mx-auto px-4 py-8 flex flex-col flex-grow">
        <header className="text-center mb-8">
          <button
            onClick={() => {
              setStatus('idle');
              setWineData(null);
              setView('scan');
            }}
            className="hover:opacity-80 transition-opacity"
          >
            <h1 className="text-4xl font-bold text-sage-800 dark:text-sage-200 mb-2 tracking-tight">
              Sommelier<span className="text-terracotta-500">AI</span>
            </h1>
          </button>
          <p className="text-lg text-stone-500 dark:text-stone-400 mb-6 font-medium">
            Discover wine, naturally.
          </p>

          {showKeyInput ? (
            <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-top-4 mb-6">
              <div className="relative flex items-center">
                <Key className="absolute left-3 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleSaveKey(e.target.value)}
                  placeholder="Enter Google Gemini API Key"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all shadow-sm"
                />
              </div>
              <p className="mt-2 text-xs text-center text-stone-400">
                Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-terracotta-500 hover:underline">Google AI Studio</a>
              </p>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <button
                onClick={handleDisconnectKey}
                className="text-xs text-stone-400 hover:text-terracotta-500 transition-colors flex items-center gap-1"
              >
                <Key className="w-3 h-3" />
                Disconnect API Key
              </button>
            </div>
          )}

          {/* Navigation Toggle */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={() => setView('scan')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${view === 'scan'
                  ? 'bg-sage-600 text-white shadow-lg shadow-sage-600/20'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
            >
              <Camera className="w-4 h-4" />
              Scan
            </button>
            <button
              onClick={() => setView('reviews')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${view === 'reviews'
                  ? 'bg-sage-600 text-white shadow-lg shadow-sage-600/20'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
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
                    <div className="w-20 h-20 border-4 border-stone-200 dark:border-stone-700 border-t-sage-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wine className="w-8 h-8 text-sage-600 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-lg font-medium text-stone-600 dark:text-stone-300 animate-pulse">
                    Asking the Sommelier...
                  </p>
                </div>
              )}

              {status === 'success' && wineData && (
                <WineCard wine={wineData} onReset={handleReset} />
              )}

              {status === 'error' && (
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-3xl max-w-md mx-auto overflow-hidden border border-red-100 dark:border-red-900/30">
                    <p className="font-medium mb-2">Could not identify wine.</p>
                    <p className="text-xs font-mono bg-white/50 dark:bg-black/20 p-3 rounded-xl text-left break-all">
                      {wineData?.error || "Check your API Key and try again."}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-2xl font-medium hover:opacity-90 transition-opacity shadow-lg"
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
