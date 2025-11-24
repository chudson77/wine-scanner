import React, { useState } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { WineCard } from './components/WineCard';
import { mockIdentifyWine } from './services/wineService';
import { Wine, Loader2 } from 'lucide-react';

function App() {
  const [status, setStatus] = useState('idle'); // idle, analyzing, success, error
  const [wineData, setWineData] = useState(null);

  const handleCapture = async (file) => {
    setStatus('analyzing');
    try {
      const data = await mockIdentifyWine(file);
      setWineData(data);
      setStatus('success');
    } catch (error) {
      console.error('Error identifying wine:', error);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setWineData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-center gap-3 mb-12 pt-8">
          <div className="p-3 bg-wine-600 rounded-2xl shadow-lg shadow-wine-600/20">
            <Wine className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sommelier<span className="text-wine-600">AI</span>
          </h1>
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
                Analyzing label...
              </p>
            </div>
          )}

          {status === 'success' && wineData && (
            <WineCard wine={wineData} onReset={handleReset} />
          )}

          {status === 'error' && (
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl">
                <p className="font-medium">Could not identify wine. Please try again.</p>
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
          <p>© 2025 SommelierAI. Demo Application.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
