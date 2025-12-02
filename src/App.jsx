```
import React, { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import WineCard from './components/WineCard';
import ReviewList from './components/ReviewList';
import { identifyWineWithGemini } from './services/wineService';
import { Wine, Loader2, Key, List, Camera } from 'lucide-react';
import BottomNav from './components/BottomNav';
import HomeDashboard from './components/HomeDashboard';
import CellarList from './components/CellarList';

function App() {
  const [status, setStatus] = useState('idle'); // idle, analyzing, success, error
  const [wineData, setWineData] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(true);
  const [view, setView] = useState('home'); // 'home', 'cellar', 'scan', 'reviews'

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
    <div className="min-h-screen bg-[#f7f7f5] dark:bg-stone-900 text-stone-800 dark:text-stone-100 flex flex-col font-sans pb-20">
      <div className="container mx-auto px-4 py-8 flex flex-col flex-grow">
        <header className="text-center mb-6">
          <button
            onClick={() => {
              setStatus('idle');
              setWineData(null);
              setView('home');
            }}
            className="hover:opacity-80 transition-opacity"
          >
            <h1 className="text-3xl font-bold text-sage-800 dark:text-sage-200 tracking-tight">
              Sommelier<span className="text-terracotta-500">AI</span>
            </h1>
          </button>

          {showKeyInput ? (
            <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-top-4 mt-6">
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
            <div className="flex justify-center mt-2">
              <button
                onClick={handleDisconnectKey}
                className="text-[10px] text-stone-400 hover:text-terracotta-500 transition-colors flex items-center gap-1"
              >
                <Key className="w-3 h-3" />
                Disconnect Key
              </button>
            </div>
          )}
        </header>

        <main className="flex flex-col items-center justify-center flex-grow">
          {view === 'home' && (
            <HomeDashboard onViewChange={setView} />
          )}

          {view === 'cellar' && (
            <div className="w-full max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 font-serif mb-4 px-2">Your Cellar</h2>
              <CellarList />
            </div>
          )}

          {view === 'reviews' && (
            <div className="w-full max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 font-serif mb-4 px-2">My Reviews</h2>
              <ReviewList />
            </div>
          )}

          {view === 'scan' && (
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
      </div >
      );
}

      export default App;
