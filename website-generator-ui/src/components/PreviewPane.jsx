// import { useState } from "react";
// import { FiGlobe, FiHome, FiZap, FiUsers, FiTarget, FiTrendingUp } from "react-icons/fi";

// export default function PreviewPane({ mode, url, leftSeedInfo }) {
//   const [iframeError, setIframeError] = useState(false);

//   if (mode === "url" && url) {
//     return (
//       <div className="h-full flex flex-col bg-white">
//         {/* Website Preview Header */}
//         <div className="flex-shrink-0 p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//               <FiGlobe className="w-4 h-4 text-white" />
//             </div>
//             <div>
//               <h3 className="font-semibold text-slate-700">Original Website Preview</h3>
//               <p className="text-sm text-slate-500 break-all">{url}</p>
//             </div>
//           </div>
//         </div>

//         {/* Website Preview Content */}
//         <div className="flex-1 overflow-hidden">
//           {url && !iframeError ? (
//             <iframe
//               src={url}
//               title="Original Website Preview"
//               className="w-full h-full border-0"
//               sandbox="allow-same-origin allow-scripts allow-forms"
//               loading="lazy"
//               onError={() => setIframeError(true)}
//               onLoad={() => setIframeError(false)}
//             />
//           ) : (
//             <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
//               <div className="text-center space-y-6 p-8 max-w-md">
//                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
//                   <FiGlobe className="w-8 h-8 text-white" />
//                 </div>

//                 <div className="space-y-3">
//                   <h3 className="text-xl font-semibold text-slate-700">Website Analysis Ready</h3>

//                   {iframeError ? (
//                     <div className="space-y-3">
//                       <p className="text-sm text-slate-500">
//                         This website cannot be embedded due to security restrictions, but we can still analyze it for cloning.
//                       </p>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                         <p className="text-sm text-blue-700">
//                           <strong>URL:</strong> {url}
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="text-sm text-slate-500">
//                       We'll analyze this website to understand its structure, design patterns, and content to create your optimized clone.
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex justify-center">
//                   <a
//                     href={url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
//                   >
//                     <FiGlobe className="w-4 h-4" />
//                     Open Website in New Tab
//                   </a>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Company Information Display (Seed Mode)
//   return (
//     <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-lg">
//             <FiHome className="w-8 h-8 text-white" />
//           </div>
//           <h3 className="text-2xl font-bold text-slate-700 mb-2">Company Information</h3>
//           <p className="text-slate-500">We'll use this information to create your custom website</p>
//         </div>

//         {/* Company Details Card */}
//         <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//           {/* Company Name Section */}
//           <div className="p-6 border-b border-slate-100">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//                 <FiHome className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h4 className="font-semibold text-slate-700">Company Name</h4>
//                 <p className="text-sm text-slate-500">Your business identity</p>
//               </div>
//             </div>
//             <div className="bg-slate-50 rounded-xl p-4">
//               <p className="text-lg font-medium text-slate-800">{leftSeedInfo?.companyName || "Your Company"}</p>
//             </div>
//           </div>

//           {/* Industry Section */}
//           <div className="p-6 border-b border-slate-100">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
//                 <FiZap className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h4 className="font-semibold text-slate-700">Industry</h4>
//                 <p className="text-sm text-slate-500">Business sector focus</p>
//               </div>
//             </div>
//             <div className="bg-slate-50 rounded-xl p-4">
//               <div className="flex items-center gap-2">
//                 <span className="text-lg font-medium text-slate-800 capitalize">
//                   {leftSeedInfo?.industry?.replace('-', ' ') || "Digital Marketing"}
//                 </span>
//                 <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-medium rounded-full">
//                   Active
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* What We'll Create Section */}
//           <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
//                 <FiTarget className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h4 className="font-semibold text-slate-700">What We'll Create</h4>
//                 <p className="text-sm text-slate-500">Your custom website will include</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
//                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
//                   <FiUsers className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <span className="text-sm font-medium text-slate-700">Professional Design</span>
//               </div>

//               <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
//                 <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
//                   <FiTrendingUp className="w-4 h-4 text-purple-600" />
//                 </div>
//                 <span className="text-sm font-medium text-slate-700">Industry Best Practices</span>
//               </div>

//               <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
//                 <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
//                   <FiZap className="w-4 h-4 text-green-600" />
//                 </div>
//                 <span className="text-sm font-medium text-slate-700">Modern Layout</span>
//               </div>

//               <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
//                 <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
//                   <FiTarget className="w-4 h-4 text-orange-600" />
//                 </div>
//                 <span className="text-sm font-medium text-slate-700">SEO Optimized</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Info Box */}
//         <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
//           <div className="flex items-start gap-3">
//             <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
//               <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div>
//               <h5 className="font-medium text-blue-800 mb-1">Ready to Generate</h5>
//               <p className="text-sm text-blue-700">
//                 Click the "Generate Website" button to create your custom website based on your company information and industry best practices.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  FiGlobe,
  FiHome,
  FiZap,
  FiUsers,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import FrameOrShot from "./FrameOrShot";

export default function PreviewPane({ mode, url, leftSeedInfo }) {
  // URL Mode (show live site or screenshot fallback)
  if (mode === "url" && url) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Website Preview Header */}
        <div className="flex-shrink-0 p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <FiGlobe className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-700">
                Original Website Preview
              </h3>
              <p className="text-sm text-slate-500 break-all">{url}</p>
            </div>
          </div>
        </div>

        {/* Website Preview Content */}
        <div className="flex-1 overflow-hidden">
          {/* Adjust height if your parent already controls it; 100% works too */}
          <FrameOrShot url={url} height="calc(100vh - 150px)" />
        </div>
      </div>
    );
  }

  // Seed Mode (company info)
  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-lg">
            <FiHome className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-700 mb-2">
            Company Information
          </h3>
          <p className="text-slate-500">
            We'll use this information to create your custom website
          </p>
        </div>

        {/* Company Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Company Name Section */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FiHome className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-700">Company Name</h4>
                <p className="text-sm text-slate-500">Your business identity</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-lg font-medium text-slate-800">
                {leftSeedInfo?.companyName || "Your Company"}
              </p>
            </div>
          </div>

          {/* Industry Section */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <FiZap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-700">Industry</h4>
                <p className="text-sm text-slate-500">Business sector focus</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-slate-800 capitalize">
                  {leftSeedInfo?.industry?.replace("-", " ") ||
                    "Digital Marketing"}
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* What We'll Create Section */}
          <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <FiTarget className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-700">
                  What We'll Create
                </h4>
                <p className="text-sm text-slate-500">
                  Your custom website will include
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiUsers className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Professional Design
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <FiTrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Industry Best Practices
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <FiZap className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Modern Layout
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <FiTarget className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  SEO Optimized
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h5 className="font-medium text-blue-800 mb-1">
                Ready to Generate
              </h5>
              <p className="text-sm text-blue-700">
                Click the "Generate Website" button to create your custom
                website based on your company information and industry best
                practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
