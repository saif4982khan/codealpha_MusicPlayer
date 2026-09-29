import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { Music2, Sparkles, ChevronRight, Headphones, Radio, Play } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { hasCompletedOnboarding, completeOnboarding } = usePlayerStore();
  const [currentStep, setCurrentStep] = useState(0);

  // Splash auto-advance on step 0
  useEffect(() => {
    if (!hasCompletedOnboarding && currentStep === 0) {
      const timer = setTimeout(() => {
        setCurrentStep(1);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding, currentStep]);

  if (hasCompletedOnboarding) return null;

  const steps = [
    // Step 0: Splash Screen
    {
      title: 'Saif',
      subtitle: 'Premium Music Player',
      isSplash: true
    },
    // Step 1
    {
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      tag: 'Intuitive Design',
      title: 'User friendly music player for your device',
      desc: 'Seamlessly navigate through your favorite artists, albums, songs and custom playlists with a pristine dark interface.',
      btnText: 'Next'
    },
    // Step 2
    {
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
      tag: 'Superior Quality',
      title: 'Enjoy a better audio experience than others',
      desc: 'Equipped with 5-band graphic equalizer, real-time audio visualization, synchronized lyrics and seamless gapless playback.',
      btnText: 'Next'
    },
    // Step 3
    {
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
      tag: 'Unlimited Music',
      title: 'Listen to the best audio & music with Saif',
      desc: 'Discover hot releases, manage offline tracks, and experience high fidelity sound designed for modern listeners.',
      btnText: 'Get Started'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const stepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2028] p-4 sm:p-6 select-none overflow-hidden">
      {/* Dynamic ambient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1D2028] via-[#242731] to-[#1D2028] pointer-events-none" />

      {/* Screen 0: Splash Loading Screen */}
      {stepData.isSplash ? (
        <div className="relative z-10 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#FF8A1F] to-[#FF9D3D] flex items-center justify-center shadow-2xl shadow-[#FF8A1F]/40 mb-6 animate-pulse">
            <Music2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Saif</h1>
          <p className="text-sm font-semibold text-[#FF8A1F] tracking-widest uppercase mt-2">
            Loading Soundscapes...
          </p>
          <div className="w-32 h-1 bg-white/[0.1] rounded-full mt-8 overflow-hidden">
            <div className="w-full h-full bg-[#FF8A1F] rounded-full animate-[pulseGlow_1.5s_infinite]" />
          </div>
        </div>
      ) : (
        /* Screens 1, 2, 3: Interactive Carousel */
        <div className="relative z-10 w-full max-w-md h-[90vh] max-h-[720px] bg-[#242731] rounded-3xl border border-white/[0.08] shadow-2xl flex flex-col justify-between p-6 sm:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
          {/* Header with Skip button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#FF8A1F] flex items-center justify-center">
                <Music2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm text-white">Saif</span>
            </div>

            <button
              onClick={handleSkip}
              className="text-xs font-semibold text-[#A9ADB7] hover:text-[#FF8A1F] transition-colors py-1 px-3 rounded-full hover:bg-white/[0.05]"
            >
              Skip
            </button>
          </div>

          {/* Center Graphic */}
          <div className="my-auto flex flex-col items-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-2xl shadow-black/60 ring-2 ring-white/10 mb-6">
              <img
                src={stepData.image}
                alt="Onboarding"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-[#FF8A1F] uppercase tracking-wider">
                {stepData.tag}
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white text-center leading-snug tracking-tight">
              {stepData.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#A9ADB7] text-center mt-2.5 leading-relaxed max-w-xs">
              {stepData.desc}
            </p>
          </div>

          {/* Footer Navigation & Progress */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-5">
            {/* Step Indicators */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((stepIdx) => {
                const isActive = currentStep === stepIdx;
                return (
                  <div
                    key={stepIdx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isActive ? 'w-8 bg-[#FF8A1F]' : 'w-2 bg-white/20'
                    }`}
                  />
                );
              })}
            </div>

            {/* Next / Get Started CTA */}
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white font-bold text-sm shadow-xl shadow-[#FF8A1F]/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>{stepData.btnText}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
