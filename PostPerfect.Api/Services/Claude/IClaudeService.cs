namespace PostPerfect.Api.Services.Claude;

public interface IClaudeService
{
    Task<ClaudeAnalysisResult> AnalyzeImageAsync(
        byte[] imageBytes,
        string contentType,
        string? vibe = null,
        string? language = null,
        string? hints = null,
        CancellationToken ct = default
    );
}
