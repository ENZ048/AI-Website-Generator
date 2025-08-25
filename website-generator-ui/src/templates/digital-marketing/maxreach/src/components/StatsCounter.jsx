import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import React from 'react'; // Included for React.Fragment usage

// Import the fallback data
import { statsCounter as fallbackData } from "../data/siteContent";

/**
 * Accepts a `data` prop.
 * If not provided, falls back to the imported `statsCounter` from siteContent.js
 */
export default function StatsCounter({ data }) {
  // Use the data prop if provided, otherwise use the imported fallback
  const d = data || fallbackData;
  const statistics = d?.statistics || [];

  const [counts, setCounts] = useState(statistics.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  // Animation logic wrapped in useCallback to prevent re-creation on every render
  // and to correctly handle dependencies on the `statistics` data.
  const animateCounts = useCallback(() => {
    statistics.forEach((stat, index) => {
      const target = parseInt(stat.value, 10) || 0;
      if (target === 0) return;

      const duration = 2000; // ms
      const frameRate = 60; // fps
      const totalFrames = Math.round((duration / 1000) * frameRate);
      const increment = target / totalFrames;
      let currentCount = 0;

      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= target) {
          currentCount = target;
          clearInterval(timer);
        }
        setCounts(prev => {
          const newCounts = [...prev];
          newCounts[index] = Math.ceil(currentCount);
          return newCounts;
        });
      }, 1000 / frameRate);
    });
  }, [statistics]); // Dependency array ensures this function updates if `statistics` data changes

  // Intersection Observer to trigger the animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounts();
        }
      },
      { threshold: 0.1 }
    );
    
    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated, animateCounts]); // `animateCounts` is now a dependency

  return (
    <section
      ref={sectionRef}
      className="py-8 sm:py-10 bg-gradient-to-r from-amber-300 to-fuchsia-600"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center text-center md:flex-nowrap gap-4 sm:gap-6">
          {statistics.map((stat, index) => (
            <Fragment key={index}>
              <div className="w-1/2 sm:w-auto sm:flex-1 p-2 sm:p-4">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  {counts[index]}
                  {stat.suffix}
                </div>
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>

              {index < statistics.length - 1 && (
                <div className="hidden h-12 sm:h-16 w-px bg-white/30 md:block" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}