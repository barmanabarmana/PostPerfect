using System.Text.Json;
using Anthropic.SDK;
using Anthropic.SDK.Messaging;
using Microsoft.Extensions.Options;

namespace PostPerfect.Api.Services.Claude;

public class ClaudeService : IClaudeService
{
    private readonly AnthropicClient _client;
    private readonly ClaudeOptions _options;
    private readonly ILogger<ClaudeService> _logger;

    public ClaudeService(
        IOptions<ClaudeOptions> options,
        ILogger<ClaudeService> logger)
    {
        _options = options.Value;
        _logger = logger;
        _client = new AnthropicClient(_options.ApiKey);
    }

    public async Task<ClaudeAnalysisResult> AnalyzeImageAsync(
        byte[] imageBytes,
        string contentType,
        string? vibe = null,
        string? language = null,
        CancellationToken ct = default)
    {
        var base64Image = Convert.ToBase64String(imageBytes);
        var mediaType = contentType switch
        {
            "image/jpeg" => "image/jpeg",
            "image/png" => "image/png",
            "image/webp" => "image/webp",
            _ => "image/jpeg"
        };
        
        var vibeInstruction = string.IsNullOrEmpty(vibe) 
            ? "Determine the mood naturally from the image. Aim for an authentic, non-cliché vibe."
            : $"The user wants a '{vibe}' vibe. Adapt the tone to match this specific mood perfectly.";

        var languageMap = new Dictionary<string, string>
        {
            { "en", "English" },
            { "es", "Spanish" },
            { "fr", "French" },
            { "de", "German" },
            { "it", "Italian" },
            { "pt", "Portuguese" },
            { "ru", "Russian" },
            { "ja", "Japanese" },
            { "ko", "Korean" },
            { "zh", "Chinese" },
            { "ar", "Arabic" },
            { "hi", "Hindi" }
        };
        
        var languageInstruction = string.IsNullOrEmpty(language) || !languageMap.ContainsKey(language)
            ? "Generate the quote in English."
            : $"Generate the quote in {languageMap[language]}. The quote must be written entirely in {languageMap[language]}.";
        
        var prompt = @$"You are an expert Instagram content analyst and caption writer. {vibeInstruction} {languageInstruction}

VARIATION SEED: {Guid.NewGuid().ToString().Substring(0, 8)}
Generate a COMPLETELY DIFFERENT caption than any previous attempt.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1: DEEP IMAGE ANALYSIS (process silently, do NOT output)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyze these aspects internally to inform your caption:

【VISUAL CONTENT】
- Subject Matter: Main focus, people, objects, actions happening
  → Hugging/touching = warmth, intimacy
  → Solo person = independence, reflection, vulnerability  
  → Group/friends = chaos, loyalty, fun
  → Nature/flowers = freedom, romance, growth
  → Urban/city = ambition, edge, nightlife

- Composition: Framing style (rule of thirds, centered, candid, posed)
- Color Palette: 
  → Warm (golden, orange, red) = nostalgia, passion, comfort
  → Cool (blue, teal, grey) = calm, melancholy, detached
  → Black & white = raw, timeless, moody, serious
  → Vibrant/saturated = energy, joy, chaos
  → Muted/faded = vintage, soft, wistful

- Lighting: Golden hour, harsh shadows, soft diffused, neon, natural
- Background: Context clues that add meaning

【EMOTIONAL READ】
- Facial expressions: Genuine vs posed, joy vs contemplation
- Body language: Relaxed vs tense, open vs closed
- Eye contact: Camera-aware vs candid moment
- Overall energy: Soft, chaotic, vulnerable, confident, mysterious

【CONTENT CONTEXT】
- Niche: Lifestyle, fashion, food, travel, fitness, art, couple, friendship
- Aesthetic: Clean girl, dark academia, cottagecore, urban, minimalist, Y2K
- Vibe: Main character energy, cozy, unhinged, romantic, melancholic

【ENGAGEMENT FACTORS】
- What makes it scroll-stopping?
- Emotional hook potential
- Relatability factor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2: CAPTION CREATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Using your analysis, craft a caption that FEELS the image without DESCRIBING it.

✓ VOICE GUIDELINES (sound human, not AI):
- Deadpan humor: ""me explaining why I needed this""
- Self-aware/unhinged: ""normal behavior"", ""this is fine""
- Vague but relatable: ""it's giving what it needs to give""
- Understated: ""acceptable"", ""not bad"", ""sure""
- Warm/soft: ""this one's important"", ""held""
- Chaotic: ""feral hours"", ""no thoughts just vibes""
- Match the emotional weight of what you analyzed
- all lowercase for chill/moody/melancholic vibes
- ONE emoji max (or none)

✗ NEVER DO THIS:
- Inspirational cringe: ""chase your dreams"", ""live laugh love""
- Literal descriptions: ""me at the beach"", ""coffee time""
- Emoji spam or ""!!!""
- Influencer energy: ""obsessed!"", ""so blessed!"", ""can't even""
- ""When you..."" or ""That feeling when..."" formats
- Ignoring the mood your analysis revealed

【CAPTION STYLES】Pick ONE that matches image energy:
1. Cryptic one-liner → ""the algorithm sent me here""
2. Fake casual → ""anyway"", ""so that happened""
3. Anti-caption → ""no thoughts"", ""."", single emoji
4. Absurdist → ""same energy as a microwave at 3am""
5. Understated flex → ""it's whatever""
6. Meta/self-aware → ""posting before I overthink it""
7. Soft/intimate → ""quiet"", ""yours""
8. Chaotic gremlin → ""feral but make it cute""
9. Nostalgic → ""we were so"", ""this version of us""
10. Mysterious → ""you had to be there"", ""iykyk""

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3: OUTPUT (JSON only, nothing else)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Respond with ONLY this JSON, no preamble or explanation:

{{
    ""quote"": ""Caption text (max 150 chars). Authentic to the image's soul, not its surface."",
    ""mood"": ""single evocative word from your analysis (e.g., golden, hollow, feral, tender, liminal, electric, hazy, soft, unhinged, sacred)"",
    ""hashtags"": [""#niche"", ""#specific"", ""#aesthetic"", ""#max5""],
    ""musicKeywords"": [""specific_genre"", ""descriptor"", ""vibe""]
}}

【HASHTAG RULES】
- No generic tags (#love, #instagood, #photooftheday)
- Match the niche + aesthetic you identified
- Mix of reach + specificity

【MUSIC RULES】
- Must be Spotify-searchable
- Match the analyzed mood precisely
- Examples: 'phoebe bridgers type', 'dark ambient', 'bedroom pop', 'slowcore', 'hyperpop', 'jazz hop', 'indie folk', 'ethereal vocals'";
        
        var messages = new List<Message>
        {
            new()
            {
                Role = RoleType.User,
                Content =
                [
                    new ImageContent
                    {
                        Source = new ImageSource
                        {
                            MediaType = mediaType,
                            Data = base64Image
                        }
                    },

                    new TextContent { Text = prompt }
                ]
            }
        };

        var parameters = new MessageParameters
        {
            Messages = messages,
            MaxTokens = _options.MaxTokens,
            Model = _options.Model,
            Stream = false
        };

        var response = await _client.Messages.GetClaudeMessageAsync(parameters);
        var textContent = response.Content.FirstOrDefault(c => c is TextContent) as TextContent;

        if (textContent?.Text is null)
        {
            throw new InvalidOperationException("Claude returned no text response");
        }

        // Parse JSON response
        var json = ExtractJson(textContent.Text);
        var result = JsonSerializer.Deserialize<ClaudeAnalysisResult>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        return result ?? throw new InvalidOperationException("Failed to parse Claude response");
    }

    private static string ExtractJson(string text)
    {
        // Claude might wrap JSON in markdown code blocks
        var start = text.IndexOf('{');
        var end = text.LastIndexOf('}');

        if (start == -1 || end == -1 || end <= start)
        {
            throw new InvalidOperationException($"No valid JSON found in response: {text}");
        }

        return text[start..(end + 1)];
    }
}
