import { useState, useEffect } from 'react';

const LOADING_PHRASES = [
  "Finding the perfect vibe",
  "Waking up the captionists",
  "Analyzing the aesthetic",
  "Consulting the AI muses",
  "Crafting your caption",
  "Reading the room vibes",
  "Summoning creative energy",
  "Channeling Instagram magic"
];

export function LoadingSpinner() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 2000); // Change phrase every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: 'var(--border-color)' }} />
        <div className="absolute inset-0 border-4 border-transparent rounded-full animate-spin" style={{ borderTopColor: 'var(--ui-link-blue)' }} />
      </div>
      <p className="mt-4" style={{ color: 'var(--text-primary)' }}>Analyzing your photo...</p>
      <p className="text-sm transition-opacity duration-300" style={{ color: 'var(--text-secondary)' }}>
        {LOADING_PHRASES[phraseIndex]}
      </p>
    </div>
  );
}
