import { useState, useEffect } from "react";

// Renamed the import to be more specific for fallback use
import { hero as fallbackHero } from "../data/siteContent";

/**
 * Accepts a `data` prop.
 * If not provided, falls back to the imported `hero` from siteContent.js
 */
export default function Hero({ data }) {
  // Use the data prop if provided, otherwise use the imported fallback
  const d = data || fallbackHero;

  const phrases = d.heading.rotatingTexts || []; // Ensure phrases is an array
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    // Guard against empty phrases array
    if (phrases.length === 0) return;

    if (isTyping) {
      const currentPhrase = phrases[currentPhraseIndex];
      if (currentText.length < currentPhrase.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1));
        }, 100); // Typing speed: 100ms per character
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, wait before starting to delete
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1500); // Wait 1.5 seconds before deleting
        return () => clearTimeout(timeout);
      }
    } else {
      // Deleting text
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 50); // Deleting speed: 50ms per character
        return () => clearTimeout(timeout);
      } else {
        // Finished deleting, move to next phrase
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setIsTyping(true);
      }
    }
  }, [currentText, currentPhraseIndex, isTyping, phrases]);

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs leading-5 text-white/70">
            <span className="rounded-full bg-custom-accent-pink px-2 py-0.5 text-[10px] text-white">
              {d.badge?.new || "New"}
            </span>
            {d.badge?.welcome || "Welcome"}
          </div>
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold flex flex-col justify-center items-center gap-1 sm:gap-2">
              <span className="text-white text-center">
                {d.heading?.prefix || "We build"}
              </span>
              <span className="text-gradient-custom pb-2 sm:pb-4 min-w-[280px] sm:min-w-[400px] text-center">
                {currentText}
                <span className="typing-cursor">|</span>
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed mt-6 sm:mt-8 lg:mt-10 px-2 sm:px-0">
              {d.description || "Default description text goes here."}
            </p>
          </div>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
            <button className="w-full sm:w-auto rounded-full bg-gradient-custom px-4 sm:px-6 py-2.5 sm:py-3 text-sm leading-6 font-medium text-white shadow-soft transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 active:scale-95">
              {d.buttons?.getStarted || "Get Started"}
            </button>
            <button className="w-full sm:w-auto rounded-full border border-white/20 px-4 sm:px-6 py-2.5 sm:py-3 text-sm leading-6 text-white/80 hover:text-white hover:bg-orange-300 hover:border-orange-400 transition-all duration-300 hover:scale-105 active:scale-95">
              {d.buttons?.viewAchievements || "View Achievements"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}