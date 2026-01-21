import { useState, useEffect, useMemo } from 'react';
import type { AnalyzeResponse } from '../types/api';
import { VibePicker } from './VibePicker';
import { LanguagePicker } from './LanguagePicker';

interface InstagramPreviewProps {
  imageUrl: string;
  result: AnalyzeResponse;
  onReset: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  vibe: string | null;
  onVibeChange: (vibe: string | null) => void;
  language: string | null;
  onLanguageChange: (language: string | null) => void;
}

export function InstagramPreview({
  imageUrl,
  result,
  onReset,
  onRegenerate,
  isRegenerating,
  vibe,
  onVibeChange,
  language,
  onLanguageChange
}: InstagramPreviewProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [lastVibe, setLastVibe] = useState(vibe);
  const [lastLanguage, setLastLanguage] = useState(language);

  // Generate random likes and comments count
  const stats = useMemo(() => ({
    likes: Math.floor(Math.random() * 9000) + 1000, // 1000-10000
    comments: Math.floor(Math.random() * 500) + 50 // 50-550
  }), [result]); // Regenerate when result changes

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  useEffect(() => {
    if (onRegenerate && !isRegenerating) {
      if (vibe !== lastVibe || language !== lastLanguage) {
        setLastVibe(vibe);
        setLastLanguage(language);
        if (lastVibe !== null || lastLanguage !== null) {
          onRegenerate();
        }
      }
    }
  }, [vibe, language, lastVibe, lastLanguage, onRegenerate, isRegenerating]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'k';
    }
    return num.toString();
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Instagram Post */}
      <div className={`bg-black border border-neutral-800 rounded-sm overflow-hidden transition-all duration-700 ${showAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 bg-black">
          <div className="flex items-center gap-2.5">
            {/* Profile picture - using uploaded photo */}
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-pink-500 ring-offset-2 ring-offset-black">
              <img
                src={imageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <button className="text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
        </div>

        {/* Photo */}
        <div className="relative aspect-square bg-black">
          {isRegenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
              <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
          <img
            src={imageUrl}
            alt="Post"
            className={`w-full h-full object-cover transition-opacity duration-300 ${isRegenerating ? 'opacity-50' : 'opacity-100'}`}
          />
        </div>

        {/* Action buttons */}
        <div className="px-3 pt-2 pb-1 bg-black">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <button className="hover:opacity-50 transition">
                <svg className="w-7 h-7" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="hover:opacity-50 transition">
                <svg className="w-7 h-7" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button className="hover:opacity-50 transition">
                <svg className="w-7 h-7" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
            <button className="hover:opacity-50 transition">
              <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {/* Likes */}
          <div className="text-white text-sm font-semibold mb-2">
            {formatNumber(stats.likes)} likes
          </div>

          {/* Caption */}
          <div className="text-white text-sm mb-1">
            <span className={`transition-opacity duration-300 ${isRegenerating ? 'opacity-30' : 'opacity-100'}`}>
              {result.quote}
            </span>
          </div>

          {/* Hashtags */}
          <div className={`text-sm mb-1 transition-opacity duration-300 ${isRegenerating ? 'opacity-30' : 'opacity-100'}`}>
            <span className="text-[#00376b]">{result.hashtags.join(' ')}</span>
          </div>

          {/* View comments */}
          <button className="text-neutral-500 text-sm mb-2">
            View all {stats.comments} comments
          </button>

          {/* Timestamp */}
          <div className="text-neutral-500 text-xs uppercase">
            Just now
          </div>
        </div>
      </div>

      {/* Controls below Instagram post */}
      <div className="mt-8 space-y-4">
        <VibePicker
          selectedVibe={vibe}
          onVibeSelect={onVibeChange}
          disabled={isRegenerating}
        />
        <LanguagePicker
          selectedLanguage={language}
          onLanguageSelect={onLanguageChange}
          disabled={isRegenerating}
        />
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex gap-3">
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRegenerating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Regenerating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate Quote
              </>
            )}
          </button>
        )}
        <button
          onClick={onReset}
          className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition border border-neutral-800"
        >
          Try Another Photo
        </button>
      </div>
    </div>
  );
}
