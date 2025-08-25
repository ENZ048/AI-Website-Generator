import { useEffect, useRef } from "react";

export default function Brands() {
  const scrollRef = useRef(null);

  // Convert vertical wheel to horizontal scroll (desktop + trackpads)
  const onWheel = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  };

  // Drag-to-scroll for mouse users
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const onMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    isDownRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    el.classList.add("cursor-grabbing");
  };

  const endDrag = () => {
    isDownRef.current = false;
    const el = scrollRef.current;
    if (el) el.classList.remove("cursor-grabbing");
  };

  const onMouseMove = (e) => {
    const el = scrollRef.current;
    if (!el || !isDownRef.current) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.2; // drag speed
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  // Optional: gentle auto-scroll marquee (toggle to true to enable)
  const enableAuto = false;
  useEffect(() => {
    if (!enableAuto) return;
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const speed = 0.3; // px/ms

    const tick = (t) => {
      const dt = t - last;
      last = t;
      el.scrollLeft += speed * dt;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enableAuto]);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-white/90 text-base sm:text-lg mb-10">
          Join over 300,000+ businesses to create unique brand designs.
        </h2>

        <div className="flex justify-center">
          <div
            ref={scrollRef}
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseLeave={endDrag}
            onMouseUp={endDrag}
            onMouseMove={onMouseMove}
            className="
              relative flex items-center gap-5
              overflow-x-auto max-w-full
              select-none
              cursor-grab
              scrollbar-hide
              px-2
            "
          >
            {[
              { name: "SnapShot", logo: "/Logo-02.png" },
              { name: "Nextmove", logo: "/Logo-01.png" },
              { name: "Product.", logo: "/Logo-08.png" },
              { name: "vision", logo: "/Logo-06.png" },
              { name: "Sitemark", logo: "/Logo-05.png" },
              { name: "umbrella", logo: "/Logo-04.png" }
            ].map((b) => (
              <div
                key={b.name}
                className="
                  inline-flex items-center justify-center
                  rounded-2xl bg-[#131326]
                  border border-white/10 hover:border-white/20
                  transition-all duration-300
                  shadow-[0_0_0_0_rgba(0,0,0,0)]
                  hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]
                  px-4 py-3
                  min-w-[205px]
                "
              >
                {/* Logo only; remove text. 
                   Use height-based sizing so different widths still look big. */}
                <img
                  src={b.logo}
                  alt={b.name}
                  className="h-12 sm:h-11 md:h-12 lg:h-14 object-contain filter brightness-0 invert"
                  loading="lazy"
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
