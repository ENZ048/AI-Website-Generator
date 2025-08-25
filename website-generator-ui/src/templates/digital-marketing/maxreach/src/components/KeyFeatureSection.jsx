import { useState, useEffect } from "react";
import * as FiIcons from "react-icons/fi";

// Import fallback data for both sections
import { keyFeature as fallbackKeyFeature, whyUs as fallbackWhyUs } from "../data/siteContent";

/**
 * Accepts a `data` prop containing `keyFeature` and `whyUs` objects.
 * If not provided, falls back to imported data from siteContent.js.
 */
export default function KeyFeatureSection({ data }) {
  // The data prop contains both keyFeature and whyUs objects from backend
  const { 
    keyFeature = fallbackKeyFeature, 
    whyUs = fallbackWhyUs 
  } = data || {};

  const rotatingTexts = whyUs?.heading?.rotatingTexts || [];
  const features = whyUs?.features || [];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (rotatingTexts.length === 0) return;

    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000;
    let timeoutId;

    const handleTyping = () => {
      const currentPhrase = rotatingTexts[currentTextIndex];
      if (!isDeleting && currentCharIndex < currentPhrase.length) {
        // Typing forward
        setCurrentCharIndex(currentCharIndex + 1);
      } else if (!isDeleting && currentCharIndex === currentPhrase.length) {
        // Pause at the end
        timeoutId = setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && currentCharIndex > 0) {
        // Deleting
        setCurrentCharIndex(currentCharIndex - 1);
      } else if (isDeleting && currentCharIndex === 0) {
        // Move to the next phrase
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
      }
    };

    timeoutId = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeoutId);
  }, [currentCharIndex, currentTextIndex, isDeleting, rotatingTexts]);

  const displayText = (rotatingTexts[currentTextIndex] || "").substring(0, currentCharIndex);

  const getIcon = (iconName) => {
    const IconComponent = FiIcons[iconName];
    if (IconComponent) {
      return <IconComponent className="text-orange-300 text-xl" />;
    }
    return <FiIcons.FiTriangle className="text-orange-300 text-xl" />; // Fallback
  };

  return (
    <section className="py-20 bg-custom-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          {/* Left Column - KEY FEATURE */}
          <div className="relative p-8 rounded-2xl overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
              style={{ backgroundImage: `url(${keyFeature?.backgroundImageUrl || "/people.png"})` }}
            />
            <div className="absolute inset-0 bg-black/30 rounded-2xl" />
            
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 bg-white/5">
                <span className="text-white text-sm font-medium">{keyFeature?.badge || "Key Feature"}</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                {keyFeature?.heading?.prefix || "Unlock"}{" "}
                <span className="text-gradient-custom">{keyFeature?.heading?.highlight || "Potential"}</span>{" "}
                {keyFeature?.heading?.suffix || "with Us"}
              </h2>
              
              <p className="text-white/80 text-lg leading-relaxed">
                {keyFeature?.description || "Default description for the key feature section."}
              </p>
              
              <button className="rounded-full bg-gradient-custom px-8 py-4 text-white font-semibold text-sm uppercase tracking-wide hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105 active:scale-95">
                {keyFeature?.button || "Get Started"}
              </button>
            </div>
          </div>

          {/* Right Column - WHY US? */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 bg-white/5">
              <span className="text-white text-sm font-medium">{whyUs?.badge || "Why Us?"}</span>
            </div>
            
            <h3 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              {whyUs?.heading?.prefix || "We Are "}{" "}
              <span className="text-gradient-custom">
                {displayText}
                <span className="typing-cursor">|</span>
              </span>
            </h3>
            
            <p className="text-white/80 text-lg leading-relaxed">
              {whyUs?.description || "Default description for why you should choose us."}
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-300/20 border border-orange-300/30 flex items-center justify-center flex-shrink-0">
                    {getIcon(feature.icon)}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold text-white">{feature.title}</h4>
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}