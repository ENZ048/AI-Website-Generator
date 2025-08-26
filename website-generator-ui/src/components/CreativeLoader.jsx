import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import confetti from 'canvas-confetti';

// Import your Lottie animations
import aiLoading from '../assets/animations/ai-loading.json';
import starLoader from '../assets/animations/star-loader-2.json';
import technology from '../assets/animations/technology.json';

const CreativeLoader = ({ isGenerating, onComplete, isWebsiteReady = false }) => {
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const animations = [
    {
      animation: aiLoading,
      text: "🤖 AI is analyzing your requirements...",
      subtext: "Processing your vision into digital reality"
    },
    {
      animation: starLoader,
      text: "⭐ Crafting your unique design...",
      subtext: "Every pixel is being carefully placed"
    },
    {
      animation: technology,
      text: "⚡ Building your website...",
      subtext: "Assembling the final masterpiece"
    },
    {
      animation: aiLoading,
      text: "🎨 Perfecting the layout...",
      subtext: "Making sure everything looks perfect"
    },
    {
      animation: starLoader,
      text: "🚀 Optimizing performance...",
      subtext: "Ensuring lightning-fast loading"
    },
    {
      animation: technology,
      text: "✨ Adding final touches...",
      subtext: "Almost there, just a few more seconds"
    }
  ];

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length);
    }, 2500); // Change animation every 2.5 seconds

    return () => clearInterval(interval);
  }, [isGenerating, animations.length]);

  // Show confetti only when website is actually ready
  useEffect(() => {
    if (isWebsiteReady && !showConfetti) {
      setShowConfetti(true);
      triggerConfetti();
    }
  }, [isWebsiteReady, showConfetti]);

  const triggerConfetti = () => {
    // Burst confetti from bottom center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 1, x: 0.5 },
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'],
      shapes: ['circle', 'square'],
      gravity: 0.8,
      scalar: 1.2,
      drift: 0,
      ticks: 200
    });

    // Additional bursts for more celebration
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 1, x: 0.3 },
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
        shapes: ['circle'],
        gravity: 0.6,
        scalar: 1.5
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 1, x: 0.7 },
        colors: ['#96ceb4', '#feca57', '#ff9ff3'],
        shapes: ['square'],
        gravity: 0.6,
        scalar: 1.5
      });
    }, 400);
  };

  if (!isGenerating) return null;

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Lottie Animation */}
        <div className="w-48 h-48 mx-auto mb-6">
          <Lottie
            animationData={animations[currentAnimation].animation}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Creative Text */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {animations[currentAnimation].text}
          </h2>
          <p className="text-gray-600 text-sm">
            {animations[currentAnimation].subtext}
          </p>
        </div>

        {/* Continuous Loader */}
        <div className="w-48 mx-auto mb-4">
          <div className="relative">
            {/* Spinning circle loader */}
            <div className="w-12 h-12 mx-auto border-4 border-gray-200 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-green-500 rounded-full animate-spin"></div>
            
            {/* Pulsing dots around the spinner */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                <div className="absolute top-1/2 right-0 transform translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-0 transform translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="animate-pulse bg-blue-400 rounded-full h-2 w-2"></div>
          <div className="animate-pulse bg-blue-400 rounded-full h-2 w-2" style={{animationDelay: '0.2s'}}></div>
          <div className="animate-pulse bg-blue-400 rounded-full h-2 w-2" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>

      {/* Confetti Celebration - Only shows when website is ready */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                🎉 Your Fresh Website is Ready! 🎉
              </h1>
              <p className="text-lg text-gray-600">
                Time to see the magic you've created!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeLoader;
