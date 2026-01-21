# PostPerfect - Development Guide for Claude Code

## Project Overview

**PostPerfect** is a stateless web application that analyzes uploaded photos using AI to generate Instagram-ready content with matching quotes and Spotify music recommendations.

**Core Principle:** Completely stateless - no database, no photo storage, everything processed in-memory and returned immediately.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend Framework | ASP.NET Core 10 Minimal API |
| Endpoints | FastEndpoints library |
| Language | C# 13 |
| AI Integration | Anthropic Claude API (Vision) |
| Music Integration | Spotify Web API |
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Architecture | Vertical Slice / Feature-based |

---

## Solution Structure

```
PostPerfect/
├── PostPerfect.sln
│
├── src/
│   └── PostPerfect.Api/
│       ├── PostPerfect.Api.csproj
│       ├── Program.cs
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       │
│       ├── Features/
│       │   └── Analyze/
│       │       ├── AnalyzeEndpoint.cs
│       │       ├── AnalyzeRequest.cs
│       │       ├── AnalyzeResponse.cs
│       │       └── AnalyzeValidator.cs
│       │
│       ├── Services/
│       │   ├── Claude/
│       │   │   ├── IClaudeService.cs
│       │   │   ├── ClaudeService.cs
│       │   │   ├── ClaudeOptions.cs
│       │   │   └── ClaudeAnalysisResult.cs
│       │   │
│       │   └── Spotify/
│       │       ├── ISpotifyService.cs
│       │       ├── SpotifyService.cs
│       │       ├── SpotifyOptions.cs
│       │       └── SpotifyTrack.cs
│       │
│       └── Common/
│           ├── Extensions/
│           │   └── ServiceCollectionExtensions.cs
│           └── Errors/
│               └── ApiError.cs
│
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── index.html
    │
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        │
        ├── components/
        │   ├── PhotoUpload.tsx
        │   ├── VibePicker.tsx
        │   ├── InstagramPreview.tsx
        │   ├── AudioPlayer.tsx
        │   └── LoadingSpinner.tsx
        │
        ├── hooks/
        │   └── useAnalyze.ts
        │
        ├── types/
        │   └── api.ts
        │
        └── lib/
            └── api.ts
```

---

## Phase 1: Backend Setup

### Step 1.1: Create Project and Install Packages

Create ASP.NET Core Empty project, then install required NuGet packages:

```xml
<!-- PostPerfect.Api.csproj -->
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="FastEndpoints" Version="5.*" />
    <PackageReference Include="FastEndpoints.Swagger" Version="5.*" />
    <PackageReference Include="Anthropic.SDK" Version="3.*" />
  </ItemGroup>
</Project>
```

### Step 1.2: Program.cs Setup

```csharp
// Program.cs
using FastEndpoints;
using FastEndpoints.Swagger;
using PostPerfect.Api.Services.Claude;
using PostPerfect.Api.Services.Spotify;

var builder = WebApplication.CreateBuilder(args);

// FastEndpoints
builder.Services.AddFastEndpoints();

// Swagger for development
builder.Services.SwaggerDocument(o =>
{
    o.DocumentSettings = s =>
    {
        s.Title = "PostPerfect API";
        s.Version = "v1";
        s.Description = "AI-powered Instagram post generator";
    };
});

// Services
builder.Services.AddClaudeService(builder.Configuration);
builder.Services.AddSpotifyService(builder.Configuration);

// CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite default
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// HttpClient for Spotify
builder.Services.AddHttpClient();

var app = builder.Build();

app.UseCors("Frontend");
app.UseFastEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerGen();
}

app.Run();
```

### Step 1.3: Configuration Files

```json
// appsettings.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Claude": {
    "Model": "claude-sonnet-4-20250514",
    "MaxTokens": 500
  },
  "Spotify": {
    "TokenEndpoint": "https://accounts.spotify.com/api/token",
    "ApiBaseUrl": "https://api.spotify.com/v1"
  },
  "Upload": {
    "MaxFileSizeBytes": 10485760,
    "AllowedContentTypes": ["image/jpeg", "image/png", "image/webp"]
  }
}
```

```json
// appsettings.Development.json
{
  "Claude": {
    "ApiKey": "sk-ant-your-key-here"
  },
  "Spotify": {
    "ClientId": "your-spotify-client-id",
    "ClientSecret": "your-spotify-client-secret"
  }
}
```

---

## Phase 2: Services Implementation

### Step 2.1: Claude Service

```csharp
// Services/Claude/ClaudeOptions.cs
namespace PostPerfect.Api.Services.Claude;

public class ClaudeOptions
{
    public const string SectionName = "Claude";
    
    public required string ApiKey { get; init; }
    public required string Model { get; init; }
    public int MaxTokens { get; init; } = 500;
}
```

```csharp
// Services/Claude/ClaudeAnalysisResult.cs
namespace PostPerfect.Api.Services.Claude;

public record ClaudeAnalysisResult(
    string Quote,
    string Mood,
    List<string> Hashtags,
    List<string> MusicKeywords
);
```

```csharp
// Services/Claude/IClaudeService.cs
namespace PostPerfect.Api.Services.Claude;

public interface IClaudeService
{
    Task<ClaudeAnalysisResult> AnalyzeImageAsync(
        byte[] imageBytes, 
        string contentType,
        string? vibe = null,
        CancellationToken ct = default
    );
}
```

```csharp
// Services/Claude/ClaudeService.cs
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
            ? "Determine the mood naturally from the image."
            : $"The user wants a '{vibe}' vibe. Incorporate this into your analysis.";

        var prompt = $"""
            Analyze this image for an Instagram post. {vibeInstruction}
            
            Respond ONLY with valid JSON in this exact format:
            {{
                "quote": "An inspiring or fitting quote for this image (max 150 chars)",
                "mood": "single word mood (e.g., peaceful, energetic, romantic, melancholic, adventurous)",
                "hashtags": ["#relevant", "#hashtags", "#max5"],
                "musicKeywords": ["genre or mood keywords", "for spotify search", "max 3 keywords"]
            }}
            
            Make the quote Instagram-worthy - short, impactful, and fitting the image's mood.
            Music keywords should help find a song that matches the image's atmosphere.
            """;

        var message = new MessageRequest
        {
            Model = _options.Model,
            MaxTokens = _options.MaxTokens,
            Messages = new List<Message>
            {
                new()
                {
                    Role = "user",
                    Content = new List<ContentBase>
                    {
                        new ImageContent
                        {
                            Source = new ImageSource
                            {
                                Type = "base64",
                                MediaType = mediaType,
                                Data = base64Image
                            }
                        },
                        new TextContent { Text = prompt }
                    }
                }
            }
        };

        var response = await _client.Messages.CreateAsync(message, ct);
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
```

```csharp
// Common/Extensions/ServiceCollectionExtensions.cs (partial - Claude)
using PostPerfect.Api.Services.Claude;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddClaudeService(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<ClaudeOptions>(
            configuration.GetSection(ClaudeOptions.SectionName));
        
        services.AddScoped<IClaudeService, ClaudeService>();
        
        return services;
    }
}
```

### Step 2.2: Spotify Service

```csharp
// Services/Spotify/SpotifyOptions.cs
namespace PostPerfect.Api.Services.Spotify;

public class SpotifyOptions
{
    public const string SectionName = "Spotify";
    
    public required string ClientId { get; init; }
    public required string ClientSecret { get; init; }
    public string TokenEndpoint { get; init; } = "https://accounts.spotify.com/api/token";
    public string ApiBaseUrl { get; init; } = "https://api.spotify.com/v1";
}
```

```csharp
// Services/Spotify/SpotifyTrack.cs
namespace PostPerfect.Api.Services.Spotify;

public record SpotifyTrack(
    string Id,
    string Name,
    string Artist,
    string AlbumName,
    string AlbumArt,
    string? PreviewUrl,
    string SpotifyUrl,
    int DurationMs
);
```

```csharp
// Services/Spotify/ISpotifyService.cs
namespace PostPerfect.Api.Services.Spotify;

public interface ISpotifyService
{
    Task<SpotifyTrack?> FindTrackAsync(
        string mood,
        List<string> keywords,
        CancellationToken ct = default
    );
}
```

```csharp
// Services/Spotify/SpotifyService.cs
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace PostPerfect.Api.Services.Spotify;

public class SpotifyService : ISpotifyService
{
    private readonly HttpClient _httpClient;
    private readonly SpotifyOptions _options;
    private readonly IMemoryCache _cache;
    private readonly ILogger<SpotifyService> _logger;
    
    private const string TokenCacheKey = "spotify_access_token";

    public SpotifyService(
        HttpClient httpClient,
        IOptions<SpotifyOptions> options,
        IMemoryCache cache,
        ILogger<SpotifyService> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _cache = cache;
        _logger = logger;
    }

    public async Task<SpotifyTrack?> FindTrackAsync(
        string mood,
        List<string> keywords,
        CancellationToken ct = default)
    {
        var token = await GetAccessTokenAsync(ct);
        
        // Build search query: combine mood and keywords
        var searchTerms = new List<string> { mood };
        searchTerms.AddRange(keywords.Take(2));
        var query = string.Join(" ", searchTerms);
        
        _logger.LogInformation("Searching Spotify for: {Query}", query);
        
        var request = new HttpRequestMessage(HttpMethod.Get,
            $"{_options.ApiBaseUrl}/search?q={Uri.EscapeDataString(query)}&type=track&limit=20");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        
        var response = await _httpClient.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();
        
        var json = await response.Content.ReadAsStringAsync(ct);
        var searchResult = JsonSerializer.Deserialize<SpotifySearchResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        
        // Find first track WITH a preview URL
        var trackWithPreview = searchResult?.Tracks?.Items?
            .FirstOrDefault(t => !string.IsNullOrEmpty(t.PreviewUrl));
        
        if (trackWithPreview is null)
        {
            _logger.LogWarning("No tracks with preview found for query: {Query}", query);
            return null;
        }
        
        return new SpotifyTrack(
            Id: trackWithPreview.Id,
            Name: trackWithPreview.Name,
            Artist: string.Join(", ", trackWithPreview.Artists.Select(a => a.Name)),
            AlbumName: trackWithPreview.Album.Name,
            AlbumArt: trackWithPreview.Album.Images.FirstOrDefault()?.Url ?? "",
            PreviewUrl: trackWithPreview.PreviewUrl,
            SpotifyUrl: trackWithPreview.ExternalUrls.Spotify,
            DurationMs: trackWithPreview.DurationMs
        );
    }

    private async Task<string> GetAccessTokenAsync(CancellationToken ct)
    {
        if (_cache.TryGetValue(TokenCacheKey, out string? cachedToken) && cachedToken is not null)
        {
            return cachedToken;
        }

        var credentials = Convert.ToBase64String(
            Encoding.UTF8.GetBytes($"{_options.ClientId}:{_options.ClientSecret}"));
        
        var request = new HttpRequestMessage(HttpMethod.Post, _options.TokenEndpoint);
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);
        request.Content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "client_credentials")
        });
        
        var response = await _httpClient.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();
        
        var json = await response.Content.ReadAsStringAsync(ct);
        var tokenResponse = JsonSerializer.Deserialize<SpotifyTokenResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        
        var token = tokenResponse?.AccessToken 
            ?? throw new InvalidOperationException("Failed to get Spotify token");
        
        // Cache token for 55 minutes (expires in 60)
        _cache.Set(TokenCacheKey, token, TimeSpan.FromMinutes(55));
        
        return token;
    }
}

// Spotify API response models (internal)
internal record SpotifyTokenResponse(string AccessToken, string TokenType, int ExpiresIn);

internal record SpotifySearchResponse(SpotifyTracksContainer? Tracks);

internal record SpotifyTracksContainer(List<SpotifyTrackItem>? Items);

internal record SpotifyTrackItem(
    string Id,
    string Name,
    List<SpotifyArtist> Artists,
    SpotifyAlbum Album,
    string? PreviewUrl,
    SpotifyExternalUrls ExternalUrls,
    int DurationMs
);

internal record SpotifyArtist(string Name);

internal record SpotifyAlbum(string Name, List<SpotifyImage> Images);

internal record SpotifyImage(string Url, int Height, int Width);

internal record SpotifyExternalUrls(string Spotify);
```

```csharp
// Common/Extensions/ServiceCollectionExtensions.cs (add Spotify)
using PostPerfect.Api.Services.Spotify;

public static IServiceCollection AddSpotifyService(
    this IServiceCollection services,
    IConfiguration configuration)
{
    services.Configure<SpotifyOptions>(
        configuration.GetSection(SpotifyOptions.SectionName));
    
    services.AddMemoryCache();
    services.AddHttpClient<ISpotifyService, SpotifyService>();
    
    return services;
}
```

---

## Phase 3: FastEndpoints Implementation

### Step 3.1: Analyze Feature

```csharp
// Features/Analyze/AnalyzeRequest.cs
namespace PostPerfect.Api.Features.Analyze;

public class AnalyzeRequest
{
    public required IFormFile Photo { get; init; }
    public string? Vibe { get; init; }
}
```

```csharp
// Features/Analyze/AnalyzeResponse.cs
using PostPerfect.Api.Services.Spotify;

namespace PostPerfect.Api.Features.Analyze;

public record AnalyzeResponse(
    string Quote,
    string Mood,
    List<string> Hashtags,
    SpotifyTrack? Track
);
```

```csharp
// Features/Analyze/AnalyzeValidator.cs
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
```

```csharp
// Features/Analyze/AnalyzeEndpoint.cs
using FastEndpoints;
using PostPerfect.Api.Services.Claude;
using PostPerfect.Api.Services.Spotify;

namespace PostPerfect.Api.Features.Analyze;

public class AnalyzeEndpoint : Endpoint<AnalyzeRequest, AnalyzeResponse>
{
    private readonly IClaudeService _claudeService;
    private readonly ISpotifyService _spotifyService;
    private readonly ILogger<AnalyzeEndpoint> _logger;

    public AnalyzeEndpoint(
        IClaudeService claudeService,
        ISpotifyService spotifyService,
        ILogger<AnalyzeEndpoint> logger)
    {
        _claudeService = claudeService;
        _spotifyService = spotifyService;
        _logger = logger;
    }

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
        _logger.LogInformation(
            "Analyzing image: {FileName}, Size: {Size}, Vibe: {Vibe}",
            req.Photo.FileName,
            req.Photo.Length,
            req.Vibe ?? "auto");

        // Read image bytes (stateless - not stored)
        using var memoryStream = new MemoryStream();
        await req.Photo.CopyToAsync(memoryStream, ct);
        var imageBytes = memoryStream.ToArray();

        // Analyze with Claude
        var analysis = await _claudeService.AnalyzeImageAsync(
            imageBytes,
            req.Photo.ContentType,
            req.Vibe,
            ct);

        _logger.LogInformation(
            "Claude analysis complete. Mood: {Mood}, Quote length: {QuoteLength}",
            analysis.Mood,
            analysis.Quote.Length);

        // Find matching track on Spotify
        var track = await _spotifyService.FindTrackAsync(
            analysis.Mood,
            analysis.MusicKeywords,
            ct);

        if (track is null)
        {
            _logger.LogWarning("No Spotify track found for mood: {Mood}", analysis.Mood);
        }

        var response = new AnalyzeResponse(
            Quote: analysis.Quote,
            Mood: analysis.Mood,
            Hashtags: analysis.Hashtags,
            Track: track
        );

        await SendAsync(response, cancellation: ct);
    }
}
```

---

## Phase 4: Frontend Implementation

### Step 4.1: Project Setup

```bash
# Create Vite React TypeScript project
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install dependencies
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 4.2: Configuration Files

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        instagram: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 min-h-screen;
}
```

### Step 4.3: TypeScript Types

```typescript
// src/types/api.ts
export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  albumName: string;
  albumArt: string;
  previewUrl: string | null;
  spotifyUrl: string;
  durationMs: number;
}

export interface AnalyzeResponse {
  quote: string;
  mood: string;
  hashtags: string[];
  track: SpotifyTrack | null;
}

export interface AnalyzeError {
  error: string;
  code: string;
}
```

### Step 4.4: API Client

```typescript
// src/lib/api.ts
import axios from 'axios';
import { AnalyzeResponse } from '../types/api';

const api = axios.create({
  baseURL: '/api',
});

export async function analyzePhoto(
  photo: File,
  vibe?: string
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append('photo', photo);
  if (vibe) {
    formData.append('vibe', vibe);
  }

  const response = await api.post<AnalyzeResponse>('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
```

### Step 4.5: Custom Hook

```typescript
// src/hooks/useAnalyze.ts
import { useState } from 'react';
import { AnalyzeResponse } from '../types/api';
import { analyzePhoto } from '../lib/api';

interface UseAnalyzeReturn {
  result: AnalyzeResponse | null;
  isLoading: boolean;
  error: string | null;
  analyze: (photo: File, vibe?: string) => Promise<void>;
  reset: () => void;
}

export function useAnalyze(): UseAnalyzeReturn {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (photo: File, vibe?: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzePhoto(photo, vibe);
      setResult(response);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze photo');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { result, isLoading, error, analyze, reset };
}
```

### Step 4.6: Components

```tsx
// src/components/PhotoUpload.tsx
import { useCallback, useState } from 'react';

interface PhotoUploadProps {
  onPhotoSelect: (file: File) => void;
  disabled?: boolean;
}

export function PhotoUpload({ onPhotoSelect, disabled }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    onPhotoSelect(file);
  }, [onPhotoSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-2xl p-8 text-center
        transition-all duration-300 cursor-pointer
        ${isDragging 
          ? 'border-pink-400 bg-pink-500/20' 
          : 'border-white/30 hover:border-white/50 bg-white/5'}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById('photo-input')?.click()}
    >
      <input
        id="photo-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      
      {preview ? (
        <img 
          src={preview} 
          alt="Preview" 
          className="max-h-64 mx-auto rounded-lg shadow-lg"
        />
      ) : (
        <div className="text-white/70">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">Drop your photo here</p>
          <p className="text-sm mt-1">or click to browse</p>
        </div>
      )}
    </div>
  );
}
```

```tsx
// src/components/VibePicker.tsx
interface VibePickerProps {
  selectedVibe: string | null;
  onVibeSelect: (vibe: string | null) => void;
  disabled?: boolean;
}

const VIBES = [
  { id: 'chill', emoji: '😌', label: 'Chill' },
  { id: 'energetic', emoji: '⚡', label: 'Energetic' },
  { id: 'romantic', emoji: '💕', label: 'Romantic' },
  { id: 'moody', emoji: '🌙', label: 'Moody' },
  { id: 'adventurous', emoji: '🌄', label: 'Adventurous' },
  { id: 'happy', emoji: '☀️', label: 'Happy' },
];

export function VibePicker({ selectedVibe, onVibeSelect, disabled }: VibePickerProps) {
  return (
    <div className="space-y-3">
      <p className="text-white/70 text-sm">Choose a vibe (optional)</p>
      <div className="flex flex-wrap gap-2">
        {VIBES.map((vibe) => (
          <button
            key={vibe.id}
            onClick={() => onVibeSelect(selectedVibe === vibe.id ? null : vibe.id)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${selectedVibe === vibe.id
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-white/10 text-white/80 hover:bg-white/20'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {vibe.emoji} {vibe.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

```tsx
// src/components/AudioPlayer.tsx
import { useState, useRef, useEffect } from 'react';
import { SpotifyTrack } from '../types/api';

interface AudioPlayerProps {
  track: SpotifyTrack;
}

export function AudioPlayer({ track }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !track.previewUrl) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!track.previewUrl) {
    return (
      <div className="text-white/50 text-sm">
        Preview not available for this track
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-black/30 rounded-lg p-3">
      <audio ref={audioRef} src={track.previewUrl} />
      
      <img 
        src={track.albumArt} 
        alt={track.albumName}
        className="w-12 h-12 rounded shadow"
      />
      
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{track.name}</p>
        <p className="text-white/60 text-sm truncate">{track.artist}</p>
        
        {/* Progress bar */}
        <div className="mt-1 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-400 transition"
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="white" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      
      <a
        href={track.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400 hover:text-green-300"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </a>
    </div>
  );
}
```

```tsx
// src/components/InstagramPreview.tsx
import { AnalyzeResponse } from '../types/api';
import { AudioPlayer } from './AudioPlayer';

interface InstagramPreviewProps {
  imageUrl: string;
  result: AnalyzeResponse;
  onReset: () => void;
}

export function InstagramPreview({ imageUrl, result, onReset }: InstagramPreviewProps) {
  return (
    <div className="max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="bg-black rounded-[3rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2.5rem] overflow-hidden">
          {/* Instagram header */}
          <div className="flex items-center gap-3 p-3 border-b">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500" />
          </div>
          
          {/* Image with quote overlay */}
          <div className="relative aspect-square">
            <img 
              src={imageUrl} 
              alt="Your post" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <p className="text-white text-lg font-medium drop-shadow-lg leading-snug">
                "{result.quote}"
              </p>
            </div>
          </div>
          
          {/* Instagram actions */}
          <div className="p-3 space-y-2">
            <div className="flex gap-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            
            {/* Hashtags */}
            <p className="text-sm text-blue-600">
              {result.hashtags.join(' ')}
            </p>
            
            {/* Mood badge */}
            <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
              Mood: {result.mood}
            </span>
          </div>
        </div>
      </div>
      
      {/* Music player below phone */}
      {result.track && (
        <div className="mt-4">
          <p className="text-white/70 text-sm mb-2">🎵 Suggested track</p>
          <AudioPlayer track={result.track} />
        </div>
      )}
      
      {/* Reset button */}
      <button
        onClick={onReset}
        className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
      >
        Try Another Photo
      </button>
    </div>
  );
}
```

```tsx
// src/components/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-white/70">Analyzing your photo...</p>
      <p className="text-white/50 text-sm">Finding the perfect vibe ✨</p>
    </div>
  );
}
```

### Step 4.7: Main App

```tsx
// src/App.tsx
import { useState } from 'react';
import { PhotoUpload } from './components/PhotoUpload';
import { VibePicker } from './components/VibePicker';
import { InstagramPreview } from './components/InstagramPreview';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAnalyze } from './hooks/useAnalyze';

function App() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  
  const { result, isLoading, error, analyze, reset } = useAnalyze();

  const handlePhotoSelect = (file: File) => {
    setPhoto(file);
    setPhotoUrl(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!photo) return;
    await analyze(photo, vibe || undefined);
  };

  const handleReset = () => {
    setPhoto(null);
    setPhotoUrl(null);
    setVibe(null);
    reset();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Post<span className="text-pink-400">Perfect</span>
          </h1>
          <p className="text-white/60">
            Turn your photos into Instagram-ready posts with AI
          </p>
        </div>

        {/* Main content */}
        {result && photoUrl ? (
          <InstagramPreview 
            imageUrl={photoUrl} 
            result={result} 
            onReset={handleReset}
          />
        ) : isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            <PhotoUpload 
              onPhotoSelect={handlePhotoSelect}
              disabled={isLoading}
            />
            
            {photo && (
              <>
                <VibePicker
                  selectedVibe={vibe}
                  onVibeSelect={setVibe}
                  disabled={isLoading}
                />
                
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-pink-500/30"
                >
                  Generate Post ✨
                </button>
              </>
            )}
            
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
```

---

## Phase 5: Running the Application

### Backend

```bash
cd src/PostPerfect.Api
dotnet run
# Runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## API Keys Setup

### Claude API Key
1. Go to https://console.anthropic.com
2. Create an API key
3. Add to `appsettings.Development.json`

### Spotify API Credentials
1. Go to https://developer.spotify.com/dashboard
2. Create an app
3. Copy Client ID and Client Secret
4. Add to `appsettings.Development.json`

---

## Testing Checklist

- [ ] Upload JPEG, PNG, WEBP images
- [ ] Verify file size validation (>10MB rejected)
- [ ] Test with/without vibe selection
- [ ] Verify Claude generates appropriate quotes
- [ ] Verify Spotify returns tracks with preview URLs
- [ ] Test audio playback (30-second preview)
- [ ] Verify "Try Another Photo" reset works
- [ ] Test error handling (API failures)

---

## Deployment Notes

### Environment Variables (Production)

```bash
Claude__ApiKey=sk-ant-xxx
Spotify__ClientId=xxx
Spotify__ClientSecret=xxx
```

### CORS Update for Production

Update `Program.cs` to use production frontend URL:

```csharp
policy.WithOrigins("https://postperfect.com")
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Spotify returns no tracks | Some searches return tracks without `preview_url`. The code already filters for tracks WITH previews. |
| Claude JSON parsing fails | Claude sometimes wraps JSON in markdown. The `ExtractJson` method handles this. |
| CORS errors | Ensure frontend URL is in CORS policy and backend is running. |
| Large file uploads fail | Check `Upload:MaxFileSizeBytes` config and Kestrel limits. |
