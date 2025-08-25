import { FiShare2, FiExternalLink } from "react-icons/fi";
import * as FiIcons from "react-icons/fi";

// Import the fallback data
import { offeringsGrid as fallbackData } from "../data/siteContent";

/**
 * Accepts a `data` prop.
 * If not provided, falls back to the imported `offeringsGrid` from siteContent.js
 */
export default function OfferingsGrid({ data }) {
  // Use the data prop if provided, otherwise use the imported fallback
  const d = data || fallbackData;
  const services = d?.services || [];

  const getIcon = (iconName) => {
    const IconComponent = FiIcons[iconName];
    if (IconComponent) {
      return <IconComponent className="text-pink-400 text-xl sm:text-2xl" />;
    }
    return <FiShare2 className="text-pink-400 text-xl sm:text-2xl" />; // Fallback
  };

  function Card({ icon, title, description }) {
    return (
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-custom-card/80 p-4 sm:p-6 transition-all duration-300 hover:border-white/20 hover:scale-[1.02]">
        <div className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl [background:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(120%_90%_at_10%_0%,transparent_20%,black_60%)]" />
        <div className="pointer-events-none absolute -inset-px rounded-xl sm:rounded-2xl bg-[radial-gradient(60%_60%_at_10%_0%,rgba(255,42,173,0.08),transparent_60%)]" />
        <div className="relative z-10">
          <div className="mb-3 sm:mb-4">{icon}</div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{title}</h3>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">{description}</p>
          <button className="group w-full rounded-full border border-white/20 px-3 sm:px-4 py-2.5 sm:py-3 text-white text-[11px] sm:text-[12px] font-semibold tracking-wide uppercase hover:border-white/40 hover:bg-white/5 transition-all duration-300 inline-flex items-center justify-center gap-2 sm:gap-3">
            <span className="grid h-5 w-5 sm:h-6 sm:w-6 place-items-center rounded-md border border-white/30 bg-white/5 transition group-hover:bg-white/10">
              <FiExternalLink className="text-pink-400" size={12} />
            </span>
            Learn More
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-custom-background relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,42,173,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,157,80,0.08),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full border border-white/20 bg-white/5 mb-4 sm:mb-6">
            <span className="text-white text-sm font-medium">
              {d?.badge || "Our Services"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 sm:mb-6">
            {d?.heading || "What We Offer"}
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
            {d?.description || "Explore our comprehensive suite of services designed to elevate your business."}
          </p>
        </div>

        {/* Row 1: 3 cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4 sm:mb-6">
          {services.slice(0, 3).map((service, index) => (
            <Card 
              key={index}
              icon={getIcon(service.icon)}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>

        {/* Row 2: 2 cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          {services.slice(3, 5).map((service, index) => (
            <Card 
              key={index + 3} // Ensure unique key
              icon={getIcon(service.icon)}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}