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
        string? hints = null,
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
        
        var vibeInstruction = GenerateVibeInstruction(vibe);

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

        var hintsInstruction = string.IsNullOrEmpty(hints)
            ? ""
            : $"\n\nCONTEXT HINTS: The user provided these keywords to help you understand the photo better: \"{hints}\". Use these hints to inform your understanding of who/what is in the photo, the occasion, relationships, or context. Make the caption more personal and accurate based on these hints.";

        var prompt = @$"You are an expert Instagram content analyst and caption writer. {vibeInstruction} {languageInstruction}{hintsInstruction}

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

    private static string GenerateVibeInstruction(string? vibe)
    {
        if (string.IsNullOrEmpty(vibe))
        {
            return "Determine the mood naturally from the image. Aim for an authentic, non-cliché vibe.";
        }

        var vibes = vibe.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(v => v.ToLowerInvariant())
            .ToList();

        if (vibes.Count == 0)
        {
            return "Determine the mood naturally from the image. Aim for an authentic, non-cliché vibe.";
        }

        var instructions = new List<string>();
        var hasPhilosophical = vibes.Contains("philosophical");
        var hasNostalgic = vibes.Contains("nostalgic");
        var regularVibes = vibes.Where(v => v != "philosophical").ToList();

        // Build base vibe instruction
        if (regularVibes.Any())
        {
            var vibeList = string.Join(", ", regularVibes.Select(v => $"'{v}'"));
            instructions.Add($"The user wants {(regularVibes.Count > 1 ? "a blend of" : "a")} {vibeList} vibe{(regularVibes.Count > 1 ? "s" : "")}. Adapt the tone to match {(regularVibes.Count > 1 ? "these moods" : "this mood")} perfectly.");
        }

        // Add nostalgic-specific instruction
        if (hasNostalgic)
        {
            instructions.Add(@"NOSTALGIC MODE: Evoke a sense of longing for the past WITHOUT overusing the word 'remember'. Use varied nostalgic vocabulary like:
- Time words: 'back then', 'those days', 'once upon a time', 'used to', 'when we were'
- Emotional words: 'miss', 'longing', 'yearning', 'echoes of', 'traces of', 'fragments of'
- Sensory words: 'faded', 'worn', 'vintage', 'timeless', 'classic'
- Reflective phrases: 'looking back', 'time flies', 'where did the time go', 'feels like yesterday'
- Poetic alternatives: 'still taste those moments', 'holding onto', 'never forget', 'forever in my mind'

IMPORTANT: Avoid starting with 'remember' or using it repeatedly. Be creative with nostalgic language.");
        }

        // Add philosophical instruction
        if (hasPhilosophical)
        {
            instructions.Add(@"PHILOSOPHICAL MODE: The caption must incorporate a relevant quote or wisdom from a known philosopher, professor, or thinker that deeply connects to what's happening in the image. Choose from thinkers like:
- Existentialists: Camus, Sartre, Nietzsche, Kierkegaard
- Ancient: Seneca, Marcus Aurelius, Epictetus, Aristotle, Plato
- Modern: Carl Sagan, Alan Watts, Jordan Peterson, Yuval Harari
- Eastern: Lao Tzu, Buddha, Confucius, Rumi
- Contemporary: Brené Brown, Naval Ravikant, James Clear

The quote must:
- Match the context and mood of the image perfectly
- Be authentic and accurately attributed
- Not be overused or cliché
- Relate to what the image represents (friendship, solitude, achievement, nature, etc.)
- Be woven naturally into the caption, not just tagged on

Format: Either start with the quote or weave it throughout. Example: 'as camus said, the only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion' or 'marcus aurelius knew: you have power over your mind, not outside events'");
        }

        // Combine vibes instruction
        if (vibes.Count > 1)
        {
            instructions.Add($"IMPORTANT: Seamlessly blend all {vibes.Count} requested vibes into one cohesive caption. The result should feel natural, not forced or disjointed.");
        }

        return string.Join("\n\n", instructions);
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
