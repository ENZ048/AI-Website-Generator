import { useState, useEffect } from "react";
import { analyzeUrl, analyzeSeed } from "../api/analyzer";
import { FiGlobe, FiHome, FiZap, FiPlay } from "react-icons/fi";

export default function GeneratorPanel({ 
  onResult, 
  onAnalysisStart, 
  onGenerationStart,
  syncContext 
}) {
  const [mode, setMode] = useState("url");
  const [url, setUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("digital-marketing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const run = async () => {
    setLoading(true);
    setError("");
    onAnalysisStart?.(); // Notify parent that analysis has started
    onGenerationStart?.(); // Notify parent to show preview panels
    
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
      syncContext?.({
        mode,
        url,
        companyName,
        industry
      });
    } catch (e) {
      console.error("Generation error:", e);
      
      let errorMessage = "Failed to generate website";
      
      if (e.response) {
        // Server responded with error status
        console.error("Server error response:", e.response);
        errorMessage = e.response.data?.error || e.response.data?.message || `Server error: ${e.response.status}`;
      } else if (e.request) {
        // Request was made but no response received
        console.error("Network error - no response received:", e.request);
        errorMessage = "Network error - please check your connection";
      } else {
        // Something else happened
        console.error("Other error:", e.message);
        errorMessage = e.message || "An unexpected error occurred";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-3xl shadow-2xl border border-gray-100" style={{ fontFamily: 'Figtree, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <FiZap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Website Generator</h2>
        <p className="text-gray-600 text-lg">Transform your ideas into stunning websites</p>
      </div>

      {/* Form Controls */}
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="flex items-center justify-center space-x-3 p-2 bg-gray-100 rounded-2xl">
          <button
            onClick={() => { setMode("url"); syncContext({ mode: "url" }); }}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              mode === "url"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
          >
            <FiGlobe className="w-5 h-5" />
            I have a website
          </button>
          <button
            onClick={() => { setMode("seed"); syncContext({ mode: "seed" }); }}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              mode === "seed"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
          >
            <FiHome className="w-5 h-5" />
            No website
          </button>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mode === "url" ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiGlobe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={url}
                onChange={(e) => { setUrl(e.target.value); syncContext({ url: e.target.value }); }}
                placeholder="https://example.com"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
              />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiHome className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={companyName}
                onChange={(e) => { setCompanyName(e.target.value); syncContext({ companyName: e.target.value }); }}
                placeholder="Your Company Name"
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
              />
            </div>
          )}
          
          <div className="relative">
            <select
              value={industry}
              onChange={(e) => { setIndustry(e.target.value); syncContext({ industry: e.target.value }); }}
              className="w-full pl-4 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm appearance-none cursor-pointer"
            >
              <option value="digital-marketing">Digital Marketing</option>
              <option value="ecommerce">E-commerce</option>
              <option value="saas">SaaS</option>
              <option value="consulting">Consulting</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="real-estate">Real Estate</option>
              <option value="restaurant">Restaurant</option>
              <option value="fitness">Fitness</option>
              <option value="creative">Creative Agency</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={run}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <FiPlay className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FiPlay className="w-5 h-5" />
                Generate Website
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
