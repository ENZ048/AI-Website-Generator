import { useRef, useState, useEffect } from "react";

/**
 * Accepts a `data` prop.
 * If not provided, falls back to the imported `testimonials` from siteContent.js
 */
export default function TestimonialsDraggable({ data }) {
  // Hardcoded image URLs only - data comes from props
  const hardcodedImages = [
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&h=80&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&h=80&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&h=80&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&h=80&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&h=80&q=80"
  ];
  
  // Hardcoded names and images - these are always static
  const hardcodedNames = [
    "Sarah Johnson",
    "Michael Chen", 
    "Emily Rodriguez",
    "David Thompson",
    "Lisa Wang"
  ];
  
  const hardcodedTitles = [
    "Marketing Director",
    "CEO & Founder",
    "Business Owner", 
    "Digital Marketing Manager",
    "E-commerce Specialist"
  ];
  
  // Get testimonials from props, or use defaults if not provided
  const testimonials = data?.testimonials || [
    {
      rating: 5,
      quote: "We struggled with brand visibility until we partnered with MaxReach. Their data-driven strategies and creative approach skyrocketed our engagement."
    },
    {
      rating: 5,
      quote: "From website development to social media marketing, MaxReach handled everything with professionalism. Our traffic and leads have doubled in just a few months"
    },
    {
      rating: 5,
      quote: "Their team understood our vision and executed it flawlessly. The website they built is not just visually stunning but also optimized for conversions!"
    },
    {
      rating: 5,
      quote: "MaxReach transformed our online presence completely. Their strategic approach and attention to detail exceeded all our expectations."
    },
    {
      rating: 5,
      quote: "The results we've seen with MaxReach are incredible. Our conversion rates improved by 300% in just 6 months!"
    }
  ];
  
  // Use header data from props if available, otherwise use defaults
  const headerData = data || {
    badge: "TESTIMONIAL",
    heading: "What Our Clients Say",
    description: "Hear from businesses that have transformed their digital presence with our expertise."
  };
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const scrollRef = useRef(null);
  const [drag, setDrag] = useState({
    active: false,
    startX: 0,
    scrollLeft: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

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
    <section 
      ref={sectionRef}
      className={`py-12 sm:py-16 lg:py-24 bg-[#0b0712] bg-[radial-gradient(1200px_500px_at_50%_0%,rgba(168,85,247,.15),transparent_60%)] transition-all duration-3000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 translate-x-8'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                 {/* Header */}
         <div className="text-center mb-12 sm:mb-16">
           <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full border border-white/15 bg-black/30 mb-4 sm:mb-6">
             <span className="text-white text-sm font-medium tracking-wide">
               {headerData.badge}
             </span>
           </div>
           <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 sm:mb-4">
             {headerData.heading}
           </h2>
           <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
             {headerData.description}
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
                       src={hardcodedImages[idx] || ""} 
                       alt={testimonial.name || "Client"}
                       className="w-full h-full object-cover"
                     />
                  </div>
                </div>
                                 <div className="text-center mb-3 sm:mb-4">
                   <h3 className="text-white text-lg sm:text-xl font-bold mb-1">{hardcodedNames[idx] || "Anonymous"}</h3>
                   <p className="text-white/60 text-xs sm:text-sm font-medium">{hardcodedTitles[idx] || "Client"}</p>
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