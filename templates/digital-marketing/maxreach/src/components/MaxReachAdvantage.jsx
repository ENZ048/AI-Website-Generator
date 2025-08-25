import { FiAward, FiCheck } from "react-icons/fi";
// Import the fallback data
import { maxReachAdvantage as fallbackData } from "../data/siteContent";

/**
 * Accepts a `data` prop.
 * If not provided, falls back to the imported `maxReachAdvantage` from siteContent.js
 */
export default function MaxReachAdvantage({ data }) {
  // Use the data prop if provided, otherwise use the imported fallback
  const d = data || fallbackData;
  const benefits = d?.benefits || [];

  return (
    <section className="relative w-full bg-[#0b0711] py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Card */}
        <div className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[36px]">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(125deg, #f72585, #ff509e, #ff8a73)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(120% 90% at 50% 10%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.05) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: 0.13,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='140' height='140' viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0.5H140M0 35.5H140M0 70.5H140M0 105.5H140M0.5 0V140M35.5 0V140M70.5 0V140M105.5 0V140' stroke='rgba(255,255,255,0.09)' stroke-width='1'/%3E%3Ccircle cx='70' cy='70' r='1' fill='rgba(255,255,255,0.11)'/%3E%3C/svg%3E\")",
              backgroundSize: "140px 140px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 md:px-10 lg:px-14 py-6 sm:py-8 md:py-12 lg:py-16">
            <h2 className="max-w-4xl text-[24px] sm:text-[28px] md:text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] text-white px-2 sm:px-0">
              {d?.heading || "Experience The MaxReach Advantage."}
            </h2>

            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-white/85 px-2 sm:px-0">
              {d?.description || "Maximize your digital impact with MaxReach—where innovation meets excellence for unmatched results."}
            </p>

            {/* Benefits */}
            <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center justify-center gap-2 sm:gap-3 text-white">
                  <span className="inline-flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-emerald-200/35 bg-emerald-300/12">
                    <FiCheck className="text-emerald-200/90 text-sm sm:text-lg" />
                  </span>
                  <span className="font-medium text-sm sm:text-base">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              className="group mt-4 sm:mt-6 md:mt-8 inline-flex items-center gap-2 sm:gap-3 rounded-full px-6 sm:px-8 py-3 sm:py-4 text-white text-sm sm:text-base font-bold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
              style={{
                background: "#f72585",
                border: "2px solid #ff8a73",
                boxShadow: "0 4px 20px rgba(247, 37, 133, 0.3)",
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.background = "#ff8a73";
                target.style.boxShadow = "0 4px 20px rgba(255, 138, 115, 0.4)";
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.background = "#f72585";
                target.style.boxShadow = "0 4px 20px rgba(247, 37, 133, 0.3)";
              }}
            >
              <FiAward className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              {(d?.button || "View Achievements").toUpperCase()}
            </button>
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-[20px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[36px] ring-1 ring-white/12" />
        </div>
      </div>
    </section>
  );
}