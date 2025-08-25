import { useState, useMemo, useEffect } from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import GeneratorPanel from "../components/GeneratorPanel";
import PreviewPane from "../components/PreviewPane";
import TemplateHost from "../templates/TemplateHost";
import { sampleContent } from "../templates/digital-marketing/maxreach/sample";

export default function HomePage() {
  console.log("HomePage render start");
  const [ctx, setCtx] = useState({ mode: "url", url: "", companyName: "", industry: "digital-marketing" });
  const [result, setResult] = useState(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showLeftFullScreen, setShowLeftFullScreen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  // Loading texts for URL mode (website cloning)
  const urlLoadingTexts = [
    "Analyzing website structure and content...",
    "Extracting design patterns and layouts...",
    "Identifying key components and sections...",
    "Processing visual elements and branding...",
    "Generating your optimized clone..."
  ];

  // Loading texts for seed mode (company generation)
  const seedLoadingTexts = [
    "Researching industry best practices...",
    "Creating company-specific content...",
    "Designing modern website structure...",
    "Optimizing for your target audience...",
    "Finalizing your custom website..."
  ];

  // Get current loading text based on mode
  const currentLoadingTexts = ctx.mode === "url" ? urlLoadingTexts : seedLoadingTexts;
  const currentLoadingText = currentLoadingTexts[loadingTextIndex];

  const templateId = result?.templateId || "digital-marketing/maxreach";
  const content = useMemo(() => result?.siteContent || sampleContent, [result]);

  // Check if we should show the preview layout
  const showPreviewLayout = result || isAnalyzing;

  const handleResult = (data) => {
    setIsAnalyzing(false);
    setResult(data);
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setLoadingTextIndex(0);
  };

  // Cycle through loading texts every 2 seconds
  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % currentLoadingTexts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isAnalyzing, currentLoadingTexts.length]);

  // Remove console.logs to reduce re-renders
  // console.log("ctx:", ctx);
  // console.log("templateId:", templateId);
  // console.log("content keys:", content && Object.keys(content));

  return (
    <div className="flex min-h-screen flex-col gap-3 p-4">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg mb-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">TEST: If you can see this blue box, React is working!</span>
        </div>
      </div>
      
      {/* Generator Panel - Always visible, positioned based on state */}
      <div className={`transition-all duration-500 ease-in-out ${
        showPreviewLayout 
          ? 'mb-4' // Small margin when previews are shown
          : 'flex-1 flex items-center justify-center' // Centered when no previews
      }`}>
                <ErrorBoundary>
          <GeneratorPanel
            onResult={handleResult}
            onContextChange={setCtx}
            onAnalysisStart={handleAnalysisStart}
            hasResult={!!result}
          />
        </ErrorBoundary>
      </div>

              {/* Preview Panes - Only visible after analysis starts */}
        {showPreviewLayout && (
          <div className="grid h-[80vh] grid-cols-1 gap-6 md:grid-cols-2 animate-in slide-in-from-bottom-2 duration-500">
              {/* Left Preview Pane */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-slate-700">
                      {ctx.mode === "url" ? "Original Website" : "Company Information"}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowLeftFullScreen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
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

              {/* Right Preview Pane */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium text-slate-700">Generated Website</span>
                  </div>
                  <button
                    onClick={() => setShowFullScreen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
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
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-100">
                        <div className="text-center space-y-6 p-8">
                          <div className="relative">
                            <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
                          </div>
                          <div className="space-y-3">
                            <h3 className="text-xl font-semibold text-slate-700">
                              {ctx.mode === "url" ? "Re-designing Your Website..." : "Creating Your Website..."}
                            </h3>
                            <p className="text-sm text-slate-500 transition-all duration-500 max-w-sm mx-auto">
                              {currentLoadingText}
                            </p>
                            <div className="flex justify-center space-x-2">
                              <div className="animate-pulse bg-blue-400 rounded-full h-2 w-2"></div>
                              <div className="animate-pulse bg-blue-400 rounded-full h-2 w-2" style={{animationDelay: '0.2s'}}></div>
                              <div className="animate-pulse bg-blue-400 rounded-full h-2 w-2" style={{animationDelay: '0.4s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <TemplateHost templateId={templateId} content={content} />
                    )}
                  </ErrorBoundary>
                </div>
              </div>
            </div>
        )}



      {/* Right Preview Full Screen Modal */}
      {showFullScreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900">Template Preview - Full Screen</h3>
              <button
                onClick={() => setShowFullScreen(false)}
                className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-auto min-h-0">
              <ErrorBoundary>
                <TemplateHost templateId={templateId} content={content} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      )}

      {/* Left Preview Full Screen Modal */}
      {showLeftFullScreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900">
                {ctx.mode === "url" ? "Original Website" : "Seed Information"} - Full Screen
              </h3>
              <button
                onClick={() => setShowLeftFullScreen(false)}
                className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-auto min-h-0">
              <ErrorBoundary>
                <PreviewPane
                  mode={ctx.mode}
                  url={ctx.url}
                  leftSeedInfo={{ companyName: ctx.companyName, industry: ctx.industry }}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
