namespace PostPerfect.Api.Services.Claude;

public record ClaudeAnalysisResult(
    string Quote,
    string Mood,
    List<string> Hashtags,
    List<string> MusicKeywords
);
