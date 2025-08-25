import { useState, useCallback, useEffect } from "react";
import { analyzeUrl, analyzeSeed, checkBackendHealth } from "../api/analyzer";
import { FiGlobe, FiHome, FiZap, FiRefreshCw, FiPlay, FiWifi, FiWifiOff } from "react-icons/fi";
import axios from "axios";

export default function GeneratorPanel({ onResult, onContextChange, onAnalysisStart, hasResult }) {
  const [mode, setMode] = useState("url");
  const [url, setUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("digital-marketing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState({ isRunning: false, checking: true });

  // Check backend health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      const status = await checkBackendHealth();
      setBackendStatus({ ...status, checking: false });
    };
    
    checkHealth();
  }, []);

  // Listen for regenerate events from parent
  useEffect(() => {
    const handleRegenerate = (event) => {
      const context = event.detail;
      setMode(context.mode);
      setUrl(context.url || "");
      setCompanyName(context.companyName || "");
      setIndustry(context.industry);
      // Trigger regeneration
      run();
    };

    window.addEventListener('regenerate', handleRegenerate);
    return () => window.removeEventListener('regenerate', handleRegenerate);
  }, []);

  const syncContext = useCallback((next = {}) => {
    onContextChange?.({
      mode,
      url,
      companyName,
      industry,
      ...next
    });
  }, [mode, url, companyName, industry, onContextChange]);

  async function run() {
    setLoading(true);
    setError("");
    onAnalysisStart?.(); // Notify parent that analysis has started
    
    try {
      // Validate inputs before sending
      if (mode === "url") {
        if (!url.trim()) {
          throw new Error("Please enter a valid website URL");
        }
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          throw new Error("URL must start with http:// or https://");
        }
      } else {
        if (!companyName.trim()) {
          throw new Error("Please enter a company name");
        }
      }
      
      if (!industry) {
        throw new Error("Please select an industry");
      }

      console.log("Sending request to API:", {
        mode,
        url: mode === "url" ? url : undefined,
        companyName: mode === "seed" ? companyName : undefined,
        industry
      });

      const data =
        mode === "url"
          ? await analyzeUrl({ url, industry })
          : await analyzeSeed({ companyName, industry });
      
      console.log("API response:", data);
      onResult?.(data);
      syncContext();
    } catch (e) {
      console.error("Generation error:", e);
      
      let errorMessage = "Failed to generate website";
      
      if (e.response) {
        // Server responded with error status
        console.error("Server error response:", e.response);
        errorMessage = e.response.data?.error || e.response.data?.message || `Server error: ${e.response.status}`;
      } else if (e.request) {
        // Request was made but no response received
        console.error("No response received:", e.request);
        errorMessage = "No response from server. Please check if the backend is running.";
      } else {
        // Something else happened
        errorMessage = e.message || "Unknown error occurred";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function regenerate() {
    // same inputs; just re-call to get a fresh variation
    await run();
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl border border-slate-700/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
            <FiZap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Website Generator</h2>
          <p className="text-slate-300 text-sm">Transform your ideas into stunning websites</p>
          
                     {/* Backend Status Indicator */}
           <div className="mt-4 flex items-center justify-center gap-2">
             {backendStatus.checking ? (
               <div className="flex items-center gap-2 text-slate-300">
                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-transparent"></div>
                 <span className="text-xs">Checking backend...</span>
               </div>
             ) : backendStatus.isRunning ? (
               <div className="flex items-center gap-2 text-green-300">
                 <FiWifi className="w-4 h-4" />
                 <span className="text-xs">Backend connected</span>
               </div>
             ) : (
               <div className="flex items-center gap-2 text-red-300">
                 <FiWifiOff className="w-4 h-4" />
                 <span className="text-xs">Backend disconnected</span>
               </div>
             )}
             
             {/* Manual Test Button */}
             <button
               onClick={async () => {
                 setBackendStatus({ isRunning: false, checking: true });
                 const status = await checkBackendHealth();
                 setBackendStatus({ ...status, checking: false });
               }}
               className="ml-2 px-2 py-1 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded transition-colors"
               title="Test backend connection"
             >
               Test
             </button>
             
             {/* Test API Endpoint Button */}
             <button
               onClick={async () => {
                 try {
                   console.log('Testing API endpoint...');
                   const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050'}/api/analyze`);
                   console.log('API endpoint test successful:', response.status);
                   alert('API endpoint is accessible! Status: ' + response.status);
                 } catch (error) {
                   console.error('API endpoint test failed:', error);
                   alert('API endpoint test failed: ' + error.message);
                 }
               }}
               className="ml-2 px-2 py-1 text-xs bg-blue-600/50 hover:bg-blue-500/50 text-blue-300 rounded transition-colors"
               title="Test API endpoint"
             >
               Test API
             </button>
           </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-4">
          {/* Mode Selection */}
          <div className="flex items-center justify-center space-x-2 p-1 bg-slate-800/50 rounded-xl">
            <button
              onClick={() => { setMode("url"); syncContext({ mode: "url" }); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === "url"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <FiGlobe className="w-4 h-4" />
              I have a website
            </button>
            <button
              onClick={() => { setMode("seed"); syncContext({ mode: "seed" }); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === "seed"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <FiHome className="w-4 h-4" />
              No website
            </button>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mode === "url" ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiGlobe className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); syncContext({ url: e.target.value }); }}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiHome className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  value={companyName}
                  onChange={(e) => { setCompanyName(e.target.value); syncContext({ companyName: e.target.value }); }}
                  placeholder="Company name"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiZap className="h-5 w-5 text-slate-400" />
              </div>
              <select
                value={industry}
                onChange={(e) => { setIndustry(e.target.value); syncContext({ industry: e.target.value }); }}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="digital-marketing">Digital Marketing</option>
                {/* add more industries later */}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <button
              onClick={run}
              disabled={loading || (mode === "url" ? !url : !companyName)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  {mode === "url" ? "Re-designing..." : "Creating..."}
                </>
              ) : (
                <>
                  <FiPlay className="w-5 h-5" />
                  {mode === "url" ? "Generate Clone" : "Generate Website"}
                </>
              )}
            </button>

            {/* Regenerate Button - Only visible when there's a result */}
            {hasResult && (
              <button
                onClick={regenerate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-200"
              >
                <FiRefreshCw className="w-5 h-5" />
                Regenerate Website
              </button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
