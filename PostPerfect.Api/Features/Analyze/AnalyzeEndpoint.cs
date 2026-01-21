using FastEndpoints;
using PostPerfect.Api.Services.Claude;
// SPOTIFY API TEMPORARILY DISABLED - API access closed by Spotify
// using PostPerfect.Api.Services.Spotify;

namespace PostPerfect.Api.Features.Analyze;

public class AnalyzeEndpoint(
    IClaudeService claudeService,
    // SPOTIFY API TEMPORARILY DISABLED
    // ISpotifyService spotifyService,
    ILogger<AnalyzeEndpoint> logger)
    : Endpoint<AnalyzeRequest, AnalyzeResponse>
{
    public override void Configure()
    {
        Post("/api/analyze");
        AllowAnonymous();
        AllowFileUploads();

        Summary(s =>
        {
            s.Summary = "Analyze a photo and generate Instagram content";
            s.Description = "Analyzes an uploaded image using AI to generate a quote, mood, hashtags, and matching music recommendation.";
        });
    }

    public override async Task HandleAsync(AnalyzeRequest req, CancellationToken ct)
    {
        logger.LogInformation(
            "Analyzing image: {FileName}, Size: {Size}, Vibe: {Vibe}, Hints: {Hints}",
            req.Photo.FileName,
            req.Photo.Length,
            req.Vibe ?? "auto",
            req.Hints ?? "none");

        // Read image bytes (stateless - not stored)
        using var memoryStream = new MemoryStream();
        await req.Photo.CopyToAsync(memoryStream, ct);
        var imageBytes = memoryStream.ToArray();

        // Analyze with Claude
        var analysis = await claudeService.AnalyzeImageAsync(
            imageBytes,
            req.Photo.ContentType,
            req.Vibe,
            req.Language,
            req.Hints,
            ct);

        logger.LogInformation(
            "Claude analysis complete. Mood: {Mood}, Quote length: {QuoteLength}",
            analysis.Mood,
            analysis.Quote.Length);

        // SPOTIFY API TEMPORARILY DISABLED - API access closed by Spotify
        // Uncomment when API access is available again
        /*
        // Find matching track on Spotify
        var track = await spotifyService.FindTrackAsync(
            analysis.Mood,
            analysis.MusicKeywords,
            ct);

        if (track is null)
        {
            logger.LogWarning("No Spotify track found for mood: {Mood}", analysis.Mood);
        }
        */

        var response = new AnalyzeResponse(
            Quote: analysis.Quote,
            Mood: analysis.Mood,
            Hashtags: analysis.Hashtags
            // SPOTIFY DISABLED: Track: track
        );

        await SendAsync(response, cancellation: ct);
    }
}
