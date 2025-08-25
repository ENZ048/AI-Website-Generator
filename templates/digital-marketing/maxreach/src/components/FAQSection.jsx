import { useState } from "react";
import { FiExternalLink, FiChevronUp, FiChevronDown } from "react-icons/fi";

// Import the fallback data
import { faq as fallbackFaq } from "../data/siteContent";

/**
 * Accepts a `data` prop.
 * If not provided, falls back to the imported `faq` from siteContent.js
 */
export default function FAQSection({ data }) {
  // Use the data prop if provided, otherwise use the imported fallback
  const d = data || fallbackFaq;
  const faqItems = d?.faqItems || [];

  // The first item's ID is used as the initial state, or null if no items exist
  const [expandedId, setExpandedId] = useState(faqItems.length > 0 ? faqItems[0].id : null);

  const toggleFAQ = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-custom-background relative">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
          {/* Left Section */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {d?.title || "Still Have Qs?"}
            </h2>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed">
              {d?.description || "Find answers to common questions about our products, hosting, domains, and support."}
            </p>

            <button className="w-full sm:w-auto inline-flex items-center gap-2 sm:gap-3 rounded-lg bg-gradient-to-r from-pink-400 to-orange-400 px-4 sm:px-6 py-2.5 sm:py-3 text-white font-semibold text-sm uppercase tracking-wide hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105 active:scale-95">
              <FiExternalLink className="text-base sm:text-lg" />
              {d?.buttonText || "View Help Center"}
            </button>
          </div>

          {/* Right Section - FAQ Items */}
          <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
            {faqItems.map((item) => {
              const open = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-xl sm:rounded-2xl border border-white/10 bg-custom-card bg-opacity-80 overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  {/* Question Row */}
                  <button
                    onClick={() => toggleFAQ(item.id)}
                    className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${item.id}`}
                    id={`faq-trigger-${item.id}`}
                  >
                    <span className="text-white font-medium text-base sm:text-lg pr-2">
                      {String(item.id).padStart(2, "0")}. {item.question}
                    </span>
                    {open ? (
                      <FiChevronUp className="text-white/60 text-lg sm:text-xl flex-shrink-0" />
                    ) : (
                      <FiChevronDown className="text-white/60 text-lg sm:text-xl flex-shrink-0" />
                    )}
                  </button>

                  {/* Answer Section with smooth animation */}
                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${item.id}`}
                    className={`
                      grid transition-[grid-template-rows] duration-400 ease-out
                      ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                    `}
                  >
                    <div
                      className={`
                        overflow-hidden px-4 sm:px-6 pb-4 sm:pb-6
                        transition-all duration-400 ease-out
                        ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}
                      `}
                    >
                      <div className="pt-3 sm:pt-4 border-t border-white/10">
                        <p className="text-white/70 text-sm sm:text-base leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}