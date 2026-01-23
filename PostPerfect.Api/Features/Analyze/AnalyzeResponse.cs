// SPOTIFY API TEMPORARILY DISABLED - API access closed by Spotify
// using CaptionIT.Api.Services.Spotify;

namespace CaptionIT.Api.Features.Analyze;

public record AnalyzeResponse(
    string Quote,
    string Mood,
    List<string> Hashtags
    // SPOTIFY DISABLED: SpotifyTrack? Track
);
