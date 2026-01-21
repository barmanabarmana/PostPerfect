// SPOTIFY API TEMPORARILY DISABLED - API access closed by Spotify
// Uncomment when API access is available again

/*
import { useState, useRef, useEffect } from 'react';
import type { SpotifyTrack } from '../types/api';

interface AudioPlayerProps {
  track: SpotifyTrack;
}

export function AudioPlayer({ track }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !track.previewUrl) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!track.previewUrl) {
    return (
      <div className="text-white/50 text-sm">
        Preview not available for this track
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-black/30 rounded-lg p-3">
      <audio ref={audioRef} src={track.previewUrl} />

      <img
        src={track.albumArt}
        alt={track.albumName}
        className="w-12 h-12 rounded shadow"
      />

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{track.name}</p>
        <p className="text-white/60 text-sm truncate">{track.artist}</p>

        {/* Progress bar *\/}
        <div className="mt-1 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-400 transition"
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="white" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <a
        href={track.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400 hover:text-green-300"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </a>
    </div>
  );
}
*/
