import { useRef, useState } from "react";
// Import the fallback data
import { testimonials as fallbackData } from "../data/siteContent";

/**
 * Accepts a `data` prop.
 * If not provided, falls back to the imported `testimonials` from siteContent.js
 */
export default function TestimonialsDraggable({ data }) {
  // Use the data prop if provided, otherwise use the imported fallback
  const d = data || fallbackData;
  const testimonials = d?.testimonials || [];

  const scrollRef = useRef(null);
  const [drag, setDrag] = useState({
    active: false,
    startX: 0,
    scrollLeft: 0,
  });

  const onMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    setDrag({
      active: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    });
  };

  const onMouseMove = (e) => {
    if (!drag.active) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - drag.startX) * 2; // scroll-fast
    el.scrollLeft = drag.scrollLeft - walk;
  };

  const stopDrag = () => setDrag((prev) => ({ ...prev, active: false }));

  const onWheel = (e) => {
    e.preventDefault();
    const el = scrollRef.current;
    if (el) el.scrollLeft += e.deltaY;
  };

  // Touch events for mobile
  const onTouchStart = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    const touch = e.touches[0];
    setDrag({
      active: true,
      startX: touch.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    });
  };

  const onTouchMove = (e) => {
    if (!drag.active) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const touch = e.touches[0];
    const x = touch.pageX - el.offsetLeft;
    const walk = (x - drag.startX) * 2; // touch scroll speed
    el.scrollLeft = drag.scrollLeft - walk;
  };

  const onTouchEnd = () => setDrag((prev) => ({ ...prev, active: false }));

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[#0b0712] bg-[radial-gradient(1200px_500px_at_50%_0%,rgba(168,85,247,.15),transparent_60%)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full border border-white/15 bg-black/30 mb-4 sm:mb-6">
            <span className="text-white text-sm font-medium tracking-wide">
              {d?.badge || "Testimonials"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 sm:mb-4">
            {d?.heading || "What Our Clients Say"}
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
            {d?.description || "Hear from businesses that have transformed their digital presence with our expertise."}
          </p>
        </div>

        {/* Draggable Panel */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-b from-[#171225] to-[#0f0b18] p-4 sm:p-6 lg:p-8">
          <div
            ref={scrollRef}
            className={`flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto max-w-full scrollbar-hide select-none ${
              drag.active ? "cursor-grabbing" : "cursor-grab"
            }`}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              maskImage: "linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)",
            }}
          >
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[24rem] rounded-xl sm:rounded-2xl border border-white/10 bg-[#2a2337]/80 p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="pointer-events-none absolute top-0 right-0 h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-tr-xl sm:rounded-tr-2xl">
                  <div className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-[#1e1630]" />
                  <div className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 h-24 w-24 sm:h-32 sm:w-32 rounded-full shadow-[0_0_0_10px_rgba(255,255,255,0.04)]" />
                  <span className="absolute top-2.5 right-3 sm:top-3.5 sm:right-4 text-pink-400 text-lg sm:text-2xl font-bold tracking-tight">99</span>
                </div>
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-pink-400/25 to-purple-400/25 border border-white/15 flex items-center justify-center overflow-hidden shadow-lg">
                    <img 
                      src={testimonial.image || ""} 
                      alt={testimonial.name || "Client"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="text-center mb-3 sm:mb-4">
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-1">{testimonial.name || "Anonymous"}</h3>
                  <p className="text-white/60 text-xs sm:text-sm font-medium">{testimonial.title || "Client"}</p>
                </div>
                <div className="flex justify-center gap-1 mb-4 sm:mb-6">
                  {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                    <span key={i} className="text-pink-400 text-lg sm:text-xl">★</span>
                  ))}
                </div>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed text-center px-1 sm:px-2">
                  "{testimonial.quote || ""}"
                </p>
              </div>
            ))}
            <div className="shrink-0 w-2 sm:w-4" />
          </div>
        </div>
      </div>
    </section>
  );
}