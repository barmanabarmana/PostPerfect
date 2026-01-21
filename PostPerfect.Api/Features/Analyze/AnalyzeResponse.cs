// SPOTIFY API TEMPORARILY DISABLED - API access closed by Spotify
// using PostPerfect.Api.Services.Spotify;

namespace PostPerfect.Api.Features.Analyze;

public record AnalyzeResponse(
    string Quote,
    string Mood,
    List<string> Hashtags
    // SPOTIFY DISABLED: SpotifyTrack? Track
);
