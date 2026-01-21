namespace PostPerfect.Api.Features.Analyze;

public class AnalyzeRequest
{
    public required IFormFile Photo { get; init; }
    public string? Vibe { get; init; }
    public string? Language { get; init; }
    public string? Hints { get; init; }
}
