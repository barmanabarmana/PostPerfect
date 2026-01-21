import { useState, useRef, useEffect } from 'react';
import { PhotoUpload, type PhotoUploadRef } from '../components/PhotoUpload';
import { VibePicker } from '../components/VibePicker';
import { LanguagePicker } from '../components/LanguagePicker';
import { HintsInput } from '../components/HintsInput';
import { InstagramPreview } from '../components/InstagramPreview';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAnalyze } from '../hooks/useAnalyze';

export function Home() {
  const photoUploadRef = useRef<PhotoUploadRef>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [vibes, setVibes] = useState<string[]>([]);
  const [language, setLanguage] = useState<string | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [starCount, setStarCount] = useState<number | null>(null);

  const { result, isLoading, error, analyze, regenerate, reset } = useAnalyze();

  // Fetch GitHub star count
  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/barmanabarmana/PostPerfect');
        const data = await response.json();
        setStarCount(data.stargazers_count);
      } catch (err) {
        console.error('Failed to fetch star count:', err);
        setStarCount(0);
      }
    };
    fetchStarCount();
  }, []);

  const handlePhotoSelect = (file: File) => {
    setPhoto(file);
    setPhotoUrl(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!photo) return;
    const vibeString = vibes.length > 0 ? vibes.join(',') : undefined;
    const hintsString = hints.length > 0 ? hints.join(', ') : undefined;
    await analyze(photo, vibeString, language || undefined, hintsString);

    // Clear photo from memory after successful analysis
    photoUploadRef.current?.reset();
  };

  const handleRegenerate = async () => {
    if (!photo) return;
    const vibeString = vibes.length > 0 ? vibes.join(',') : undefined;
    const hintsString = hints.length > 0 ? hints.join(', ') : undefined;
    await regenerate(photo, vibeString, language || undefined, hintsString);
  };

  const handleReset = () => {
    setPhoto(null);
    setPhotoUrl(null);
    setVibes([]);
    setLanguage(null);
    setHints([]);
    reset();
    photoUploadRef.current?.reset();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* GitHub Star Button */}
      <div className="flex justify-end mb-4">
        <a
          href="https://github.com/barmanabarmana/PostPerfect"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-dashed transition-all hover:scale-105"
          style={{ borderColor: 'var(--border-color)' }}
        >
          {/* Star Icon */}
          <svg className="w-5 h-5" fill="none" stroke="var(--text-primary)" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>

          {/* Star Count */}
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {starCount !== null ? starCount : '...'}
          </span>

          {/* GitHub Logo (appears on hover) */}
          <svg className="w-4 h-4 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="var(--text-primary)" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <button onClick={handleReset} className="inline-block cursor-pointer hover:opacity-80 transition-opacity">
          <h1 className="text-5xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Post<span className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] bg-clip-text text-transparent">IT</span>
          </h1>
        </button>
      </div>

      {/* Main content */}
      {result && photoUrl ? (
        <InstagramPreview
          imageUrl={photoUrl}
          result={result}
          onReset={handleReset}
          onRegenerate={handleRegenerate}
          isRegenerating={isLoading}
          vibes={vibes}
          onVibesChange={setVibes}
          language={language}
          onLanguageChange={setLanguage}
          hints={hints}
          onHintsChange={setHints}
        />
      ) : isLoading && !result ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Explanation section */}
          {!photo && (
            <div className="mb-12 text-center max-w-3xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-surface)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border-color)' }}>
                  <div className="text-3xl mb-3">📸</div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Upload Your Photo</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Select any image you want to turn into an Instagram post
                  </p>
                </div>
                <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-surface)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border-color)' }}>
                  <div className="text-3xl mb-3">🎨</div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>AI Analysis</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Our AI analyzes your photo and generates perfect captions, moods, and hashtags
                  </p>
                </div>
                <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-surface)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border-color)' }}>
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Get Your Post</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Preview your Instagram-ready post with professional formatting
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6 max-w-lg mx-auto">
            <PhotoUpload
              ref={photoUploadRef}
              onPhotoSelect={handlePhotoSelect}
              disabled={isLoading}
            />

            {photo && (
              <>
                <HintsInput
                  hints={hints}
                  onHintsChange={setHints}
                  disabled={isLoading}
                />

                <VibePicker
                  selectedVibes={vibes}
                  onVibeSelect={setVibes}
                  disabled={isLoading}
                />

                <LanguagePicker
                  selectedLanguage={language}
                  onLanguageSelect={setLanguage}
                  disabled={isLoading}
                />

                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  Generate Post
                </button>
              </>
            )}

            {error && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(237, 73, 86, 0.1)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--ui-like-red)', color: 'var(--ui-like-red)' }}>
                {error}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
