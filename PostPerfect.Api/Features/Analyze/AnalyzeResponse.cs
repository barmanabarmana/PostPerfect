// SPOTIFY API TEMPORARILY DISABLED - API access closed by Spotify
// using QuoteIT.Api.Services.Spotify;

namespace QuoteIT.Api.Features.Analyze;

public record AnalyzeResponse(
    string Quote,
    string Mood,
    List<string> Hashtags
    // SPOTIFY DISABLED: SpotifyTrack? Track
);
