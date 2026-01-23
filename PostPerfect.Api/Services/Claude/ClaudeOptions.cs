namespace QuoteIT.Api.Services.Claude;

public class ClaudeOptions
{
    public const string SectionName = "Claude";

    public required string ApiKey { get; init; }
    public required string Model { get; init; }
    public int MaxTokens { get; init; } = 500;
}
