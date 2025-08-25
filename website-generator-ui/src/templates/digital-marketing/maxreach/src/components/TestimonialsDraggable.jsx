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

  return (
    <section className="py-24 bg-[#0b0712] bg-[radial-gradient(1200px_500px_at_50%_0%,rgba(168,85,247,.15),transparent_60%)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/15 bg-black/30 mb-6">
            <span className="text-white text-sm font-medium tracking-wide">
              {d?.badge || "Testimonials"}
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            {d?.heading || "What Our Clients Say"}
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-3xl mx-auto">
            {d?.description || "Hear from businesses that have transformed their digital presence with our expertise."}
          </p>
        </div>

        {/* Draggable Panel */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#171225] to-[#0f0b18] p-6 lg:p-8">
          <div
            ref={scrollRef}
            className={`flex gap-8 overflow-x-auto max-w-full scrollbar-hide select-none ${
              drag.active ? "cursor-grabbing" : "cursor-grab"
            }`}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onWheel={onWheel}
            style={{
              maskImage: "linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)",
            }}
          >
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 w-[24rem] rounded-2xl border border-white/10 bg-[#2a2337]/80 p-8 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="pointer-events-none absolute top-0 right-0 h-20 w-20 overflow-hidden rounded-tr-2xl">
                  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#1e1630]" />
                  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full shadow-[0_0_0_10px_rgba(255,255,255,0.04)]" />
                  <span className="absolute top-3.5 right-4 text-pink-400 text-2xl font-bold tracking-tight">99</span>
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400/25 to-purple-400/25 border border-white/15 flex items-center justify-center overflow-hidden shadow-lg">
                    <img 
                      src={testimonial.image || ""} 
                      alt={testimonial.name || "Client"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <h3 className="text-white text-xl font-bold mb-1">{testimonial.name || "Anonymous"}</h3>
                  <p className="text-white/60 text-sm font-medium">{testimonial.title || "Client"}</p>
                </div>
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                    <span key={i} className="text-pink-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-white/80 text-base leading-relaxed text-center px-2">
                  "{testimonial.quote || ""}"
                </p>
              </div>
            ))}
            <div className="shrink-0 w-4" />
          </div>
        </div>
      </div>
    </section>
  );
}