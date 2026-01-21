import { useState } from 'react';
import { PhotoUpload } from './components/PhotoUpload';
import { VibePicker } from './components/VibePicker';
import { LanguagePicker } from './components/LanguagePicker';
import { InstagramPreview } from './components/InstagramPreview';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAnalyze } from './hooks/useAnalyze';

function App() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);

  const { result, isLoading, error, analyze, regenerate, reset } = useAnalyze();

  const handlePhotoSelect = (file: File) => {
    setPhoto(file);
    setPhotoUrl(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!photo) return;
    await analyze(photo, vibe || undefined, language || undefined);
  };

  const handleRegenerate = async () => {
    if (!photo) return;
    await regenerate(photo, vibe || undefined, language || undefined);
  };

  const handleReset = () => {
    setPhoto(null);
    setPhotoUrl(null);
    setVibe(null);
    setLanguage(null);
    reset();
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">
            Post<span className="text-neutral-400">Perfect</span>
          </h1>
        </div>

        {/* Main content */}
        {result && photoUrl ? (
          <InstagramPreview
            imageUrl={photoUrl}
            result={result}
            onReset={handleReset}
            onRegenerate={handleRegenerate}
            isRegenerating={isLoading}
            vibe={vibe}
            onVibeChange={setVibe}
            language={language}
            onLanguageChange={setLanguage}
          />
        ) : isLoading && !result ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Explanation section */}
            {!photo && (
              <div className="mb-12 text-center max-w-3xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                    <div className="text-3xl mb-3">📸</div>
                    <h3 className="text-white font-semibold mb-2">Upload Your Photo</h3>
                    <p className="text-neutral-500 text-sm">
                      Select any image you want to turn into an Instagram post
                    </p>
                  </div>
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                    <div className="text-3xl mb-3">🎨</div>
                    <h3 className="text-white font-semibold mb-2">AI Analysis</h3>
                    <p className="text-neutral-500 text-sm">
                      Our AI analyzes your photo and generates perfect captions, moods, and hashtags
                    </p>
                  </div>
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                    <div className="text-3xl mb-3">✨</div>
                    <h3 className="text-white font-semibold mb-2">Get Your Post</h3>
                    <p className="text-neutral-500 text-sm">
                      Preview your Instagram-ready post with professional formatting
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6 max-w-lg mx-auto">
              <PhotoUpload
                onPhotoSelect={handlePhotoSelect}
                disabled={isLoading}
              />

              {photo && (
                <>
                  <VibePicker
                    selectedVibe={vibe}
                    onVibeSelect={setVibe}
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
                    className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl transition border border-neutral-700"
                  >
                    Generate Post
                  </button>
                </>
              )}

              {error && (
                <div className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl text-red-400">
                  {error}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
