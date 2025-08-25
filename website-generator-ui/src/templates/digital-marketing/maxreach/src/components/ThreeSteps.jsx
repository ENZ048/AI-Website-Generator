import * as FiIcons from "react-icons/fi";
// Import the fallback data
import { threeSteps as fallbackData } from "../data/siteContent";

/**
 * Accepts a `data` prop.
 * If not provided, falls back to the imported `threeSteps` from siteContent.js
 */
export default function ThreeSteps({ data }) {
  // Use the data prop if provided, otherwise use the imported fallback
  const d = data || fallbackData;
  const steps = d?.steps || [];

  const getIcon = (iconName) => {
    const IconComponent = FiIcons[iconName];
    if (IconComponent) {
      return <IconComponent className="text-white text-3xl" />;
    }
    return <FiIcons.FiPhone className="text-white text-3xl" />; // Fallback
  };

  return (
    <section className="relative py-20 overflow-hidden bg-[radial-gradient(120%_120%_at_50%_0%,#1B072F_0%,#0F0423_60%,#0B031C_100%)]">
      {/* Background shapes */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-40 left-1/2 h-80 w-[110%] -translate-x-1/2 rounded-[40px] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,0,128,0.07),transparent_60%)]" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[120%] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(255,140,64,0.08),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5">
            <span className="text-[12px] font-semibold tracking-wider text-white">
              {d?.badge || "How It Works"}
            </span>
          </span>
        </div>

        {/* Heading + sub */}
        <div className="text-center mb-14">
          <h2 className="mb-4 text-4xl lg:text-5xl font-extrabold text-white">
            {d?.heading || "Simple Steps to Success"}
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/70">
            {d?.description || "Follow our straightforward process to achieve your goals effectively and efficiently."}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center lg:pr-8"
            >
              {/* Vertical divider */}
              <span
                className={`pointer-events-none absolute right-0 top-2 hidden h-[85%] w-px lg:block ${
                  i === steps.length - 1 ? "opacity-0" : "opacity-100"
                } bg-white/10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]`}
              />

              {/* Icon disc with conditional background */}
              <div
                className={`mb-6 grid h-20 w-20 place-items-center rounded-full shadow-lg shadow-pink-500/30 ring-1 ring-white/10 ${
                  i === steps.length - 1
                    ? "bg-gradient-to-br from-orange-400 to-pink-400"
                    : "bg-gradient-to-br from-pink-500 to-fuchsia-500"
                }`}
              >
                {getIcon(step.icon)}
              </div>

              <h3 className="mb-2 text-[18px] font-semibold text-white">{step.title}</h3>
              <p className="mb-6 max-w-[280px] text-sm leading-relaxed text-white/70">
                {step.description}
              </p>

              <button
                className="mt-auto inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider
                bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/25 hover:opacity-90 transition"
              >
                {d?.buttonText || "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}