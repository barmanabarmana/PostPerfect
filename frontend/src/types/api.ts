// SPOTIFY API TEMPORARILY DISABLED - API access closed by Spotify
// Uncomment when API access is available again
/*
export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  albumName: string;
  albumArt: string;
  previewUrl: string | null;
  spotifyUrl: string;
  durationMs: number;
}
*/

export interface AnalyzeResponse {
  quote: string;
  mood: string;
  hashtags: string[];
  // SPOTIFY DISABLED: track: SpotifyTrack | null;
}

export interface AnalyzeError {
  error: string;
  code: string;
}
