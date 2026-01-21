using FastEndpoints;
using FluentValidation;

namespace PostPerfect.Api.Features.Analyze;

public class AnalyzeValidator : Validator<AnalyzeRequest>
{
    private static readonly string[] AllowedContentTypes =
        ["image/jpeg", "image/png", "image/webp"];

    private const int MaxFileSizeBytes = 10 * 1024 * 1024; // 10MB

    public AnalyzeValidator()
    {
        RuleFor(x => x.Photo)
            .NotNull()
            .WithMessage("Photo is required");

        RuleFor(x => x.Photo.Length)
            .LessThanOrEqualTo(MaxFileSizeBytes)
            .When(x => x.Photo is not null)
            .WithMessage($"File size must not exceed {MaxFileSizeBytes / 1024 / 1024}MB");

        RuleFor(x => x.Photo.ContentType)
            .Must(ct => AllowedContentTypes.Contains(ct))
            .When(x => x.Photo is not null)
            .WithMessage($"File type must be one of: {string.Join(", ", AllowedContentTypes)}");

        RuleFor(x => x.Vibe)
            .MaximumLength(50)
            .When(x => x.Vibe is not null)
            .WithMessage("Vibe must not exceed 50 characters");
    }
}
