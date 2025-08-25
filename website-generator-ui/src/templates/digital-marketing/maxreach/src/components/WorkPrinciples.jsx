import { FiEdit3 } from "react-icons/fi";
import * as FiIcons from "react-icons/fi";
// Import the fallback data
import { workPrinciples as fallbackData } from "../data/siteContent";

/**
 * Accepts a `data` prop.
 * If not provided, falls back to the imported `workPrinciples` from siteContent.js
 */
export default function WorkPrinciples({ data }) {
  // Use the data prop if provided, otherwise use the imported fallback
  const d = data || fallbackData;
  const statistics = d?.statistics || [];
  const features = d?.features || [];

  const getIcon = (iconName) => {
    const IconComponent = FiIcons[iconName];
    if (IconComponent) {
      return <IconComponent className="text-orange-400 text-xl" />;
    }
    return <FiEdit3 className="text-orange-400 text-xl" />; // Fallback
  };

  return (
    <section className="py-20 bg-custom-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          
          {/* Left Column */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-orange-400/40 bg-orange-400/10">
              <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-wide">
                {d?.badge || "About Us"}
              </span>
            </div>
            <h2 className="text-white font-bold leading-tight text-3xl sm:text-4xl lg:text-5xl">
              {d?.heading || "Our Guiding Principles"}
            </h2>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl">
              {d?.description || "Our commitment to excellence is reflected in our core principles, driving every project we undertake."}
            </p>
            <div className="flex gap-12 sm:gap-16 pt-2">
              {statistics.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl sm:text-4xl font-bold text-orange-400 mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-[11px] sm:text-sm font-medium tracking-wider uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Column: Image */}
          <div className="flex justify-center lg:justify-center">
            <div className="relative rounded-2xl bg-[#131326] p-2 border border-white/10 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]">
              <div className="overflow-hidden rounded-xl">
                <img
                  src={d?.image?.src || "/people.png"}
                  alt={d?.image?.alt || "Team collaboration"}
                  className="w-[280px] h-[360px] sm:w-[300px] sm:h-[380px] md:w-[320px] md:h-[420px] lg:w-[340px] lg:h-[460px] object-cover filter grayscale hover:grayscale-0 transition duration-500 ease-out"
                  loading="lazy"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
            </div>
          </div>

          {/* Right Column: Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-400/15 border border-orange-400/30 flex items-center justify-center flex-shrink-0">
                  {getIcon(feature.icon)}
                </div>
                <div className="space-y-2">
                  <h3 className="text-white text-lg sm:text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}