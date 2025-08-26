import { useState, useEffect } from "react";
import GeneratorPanel from "../components/GeneratorPanel";
import PreviewPane from "../components/PreviewPane";
import { ErrorBoundary } from "../components/ErrorBoundary";
import TemplateHost from "../templates/TemplateHost";
import CreativeLoader from "../components/CreativeLoader";
import { FiZap } from "react-icons/fi";
import confetti from 'canvas-confetti';

export default function HomePage() {
  const [result, setResult] = useState(null);
  const [ctx, setCtx] = useState({
    mode: "url",
    url: "",
    companyName: "",
    industry: "digital-marketing"
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPreviewLayout, setShowPreviewLayout] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showLeftFullScreen, setShowLeftFullScreen] = useState(false);
  const [websiteReady, setWebsiteReady] = useState(false);
  // Context synchronization function
  const syncContext = (updates = {}) => {
    setCtx(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Trigger confetti when website is ready
  useEffect(() => {
    if (websiteReady) {
      // Burst confetti from bottom center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 1, x: 0.5 },
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'],
        shapes: ['circle', 'square'],
        gravity: 0.8,
        scalar: 1.2,
        drift: 0,
        ticks: 200
      });

      // Additional bursts for more celebration
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 1, x: 0.3 },
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
          shapes: ['circle'],
          gravity: 0.6,
          scalar: 1.5
        });
      }, 200);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 1, x: 0.7 },
          colors: ['#96ceb4', '#feca57', '#ff9ff3'],
          shapes: ['square'],
          gravity: 0.6,
          scalar: 1.5
        });
      }, 400);

      // Hide the celebration message after 3 seconds
      setTimeout(() => {
        setWebsiteReady(false);
      }, 3000);
    }
  }, [websiteReady]);

  const handleResult = (data) => {
    console.log("Received result data:", data);
    setResult(data);
    setIsAnalyzing(false);
    setWebsiteReady(true);
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setShowPreviewLayout(false);
    setResult(null);
    setWebsiteReady(false);
  };

  return (
    <>
      {/* Figtree Font Import - Only for this page */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap');
          
          .generator-page {
            font-family: 'Figtree', sans-serif;
          }
        `}
      </style>
      
      <div className="generator-page min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">

        
        <div className="flex min-h-screen flex-col gap-6 p-6">
          {/* Generator Panel - Always visible, positioned based on state */}
          <div className={`transition-all duration-500 ease-in-out ${
            showPreviewLayout 
              ? 'mb-6' // Small margin when previews are shown
              : 'flex-1 flex items-center justify-center' // Centered when no previews
          }`}>
            <ErrorBoundary>
              <GeneratorPanel
                onResult={handleResult}
                onAnalysisStart={() => setIsAnalyzing(true)}
                onGenerationStart={() => setShowPreviewLayout(true)}
                syncContext={syncContext}
              />
            </ErrorBoundary>
          </div>

          {/* Back to Generator Button */}
          {showPreviewLayout && (
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => {
                  setShowPreviewLayout(false);
                  setIsAnalyzing(false);
                  setResult(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Generator
              </button>
            </div>
          )}

          {/* Preview Layout */}
          {showPreviewLayout && (
            <div className="grid h-[80vh] grid-cols-1 gap-6 md:grid-cols-2 animate-in slide-in-from-bottom-2 duration-500">
              {/* Left Preview Pane - User Website or Company Info */}
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">
                      {ctx.mode === "url" ? "Original Website" : "Company Information"}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowLeftFullScreen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Full Screen
                  </button>
                </div>
                <div className="h-[calc(100%-52px)] overflow-auto">
                  <ErrorBoundary>
                    <PreviewPane
                      mode={ctx.mode}
                      url={ctx.url}
                      leftSeedInfo={{ companyName: ctx.companyName, industry: ctx.industry }}
                    />
                  </ErrorBoundary>
                </div>
              </div>

              {/* Right Preview Pane - Generated Website */}
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">Generated Website</span>
                  </div>
                  <button
                    onClick={() => setShowFullScreen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Full Screen
                  </button>
                </div>
                <div className="h-[calc(100%-52px)] overflow-auto">
                  <ErrorBoundary>
                    {isAnalyzing ? (
                      <CreativeLoader 
                        isGenerating={isAnalyzing}
                        isWebsiteReady={false}
                      />
                    ) : result ? (
                      result.templateId && result.siteContent ? (
                        <div className="min-h-full w-full relative">
                          <TemplateHost
                            templateId={result.templateId}
                            content={result.siteContent}
                          />
                          {/* Show confetti celebration when website first appears */}
                          {websiteReady && (
                            <div className="fixed inset-0 pointer-events-none z-10">
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200">
                                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                    🎉 Your Fresh Website is Ready! 🎉
                                  </h1>
                                  <p className="text-lg text-gray-600">
                                    Time to see the magic you've created!
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-50">
                          <div className="text-center p-8">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Result Received</h3>
                            <p className="text-sm text-gray-500 mb-4">But missing template data</p>
                            <pre className="text-xs text-gray-400 bg-gray-100 p-3 rounded overflow-auto max-h-40">
                              {JSON.stringify(result, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center p-8">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiZap className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Generate</h3>
                          <p className="text-sm text-gray-500">Click "Generate Website" to create your stunning website</p>
                        </div>
                      </div>
                    )}
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Modal for Generated Website */}
      {showFullScreen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Generated Website - Full Screen</h2>
            <button
              onClick={() => setShowFullScreen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            {result && (
              <div className="min-h-full w-full">
                <TemplateHost
                  templateId={result.templateId || "digital-marketing/maxreach"}
                  content={result.siteContent}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Screen Modal for Left Preview */}
      {showLeftFullScreen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">
              {ctx.mode === "url" ? "Original Website" : "Company Information"} - Full Screen
            </h2>
            <button
              onClick={() => setShowLeftFullScreen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <ErrorBoundary>
              <PreviewPane
                mode={ctx.mode}
                url={ctx.url}
                leftSeedInfo={{ companyName: ctx.companyName, industry: ctx.industry }}
              />
            </ErrorBoundary>
          </div>
        </div>
      )}
    </>
  );
}
