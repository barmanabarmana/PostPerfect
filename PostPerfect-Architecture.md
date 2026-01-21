# PostPerfect - Architecture Overview

## 🎯 Project Vision

A stateless web application that analyzes uploaded photos using AI to generate Instagram-ready posts with matching quotes and music recommendations.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
│                         (React + Vite + Tailwind)                       │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────────────────┐    │
│  │ PhotoUpload │───▶│ VibePicker  │───▶│   InstagramPreview       │    │
│  │  Component  │    │ (Optional)  │    │  - Quote overlay         │    │
│  └─────────────┘    └─────────────┘    │  - Music player (30s)    │    │
│                                         │  - Share buttons         │    │
│                                         └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ POST /api/analyze
                                    │ (multipart/form-data)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                     │
│                    (ASP.NET Core Minimal API - .NET 10)                 │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      AnalyzeEndpoint                             │   │
│  │                      POST /api/analyze                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                          │                    │                          │
│                          ▼                    ▼                          │
│  ┌──────────────────────────┐    ┌──────────────────────────┐          │
│  │     ClaudeService        │    │     SpotifyService       │          │
│  │  - Analyze image         │    │  - Search tracks         │          │
│  │  - Generate quote        │    │  - Get preview URL       │          │
│  │  - Determine mood        │    │  - Fetch album art       │          │
│  └──────────────────────────┘    └──────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────────┘
                          │                    │
                          ▼                    ▼
              ┌───────────────────┐  ┌───────────────────┐
              │   Claude API      │  │   Spotify API     │
              │   (Anthropic)     │  │   (Web API)       │
              │                   │  │                   │
              │  - Vision model   │  │  - /search        │
              │  - claude-sonnet  │  │  - /tracks        │
              └───────────────────┘  └───────────────────┘
```

---

## 📁 Solution Structure

```
PostPerfect/
│
├── 📁 src/
│   │
│   └── 📁 PostPerfect.Api/
│       ├── 📄 Program.cs                 # App entry, DI, middleware
│       ├── 📄 appsettings.json           # Configuration
│       │
│       ├── 📁 Endpoints/
│       │   └── 📄 AnalyzeEndpoint.cs     # POST /api/analyze
│       │
│       ├── 📁 Services/
│       │   ├── 📄 IClaudeService.cs
│       │   ├── 📄 ClaudeService.cs       # Claude API integration
│       │   ├── 📄 ISpotifyService.cs
│       │   └── 📄 SpotifyService.cs      # Spotify API integration
│       │
│       ├── 📁 Models/
│       │   ├── 📄 AnalyzeRequest.cs      # Input model
│       │   ├── 📄 VibeResponse.cs        # Output model
│       │   ├── 📄 ClaudeAnalysis.cs      # Claude response mapping
│       │   └── 📄 TrackInfo.cs           # Spotify track data
│       │
│       └── 📁 Configuration/
│           ├── 📄 ClaudeOptions.cs
│           └── 📄 SpotifyOptions.cs
│
├── 📁 tests/
│   └── 📁 PostPerfect.Api.Tests/
│       ├── 📄 AnalyzeEndpointTests.cs
│       └── 📄 ClaudeServiceTests.cs
│
└── 📁 frontend/
    ├── 📄 package.json
    ├── 📄 vite.config.ts
    ├── 📄 tailwind.config.js
    │
    └── 📁 src/
        ├── 📄 App.tsx
        ├── 📄 main.tsx
        │
        ├── 📁 components/
        │   ├── 📄 PhotoUpload.tsx
        │   ├── 📄 VibePicker.tsx
        │   ├── 📄 InstagramPreview.tsx
        │   └── 📄 AudioPlayer.tsx
        │
        ├── 📁 hooks/
        │   └── 📄 useAnalyze.ts
        │
        └── 📁 types/
            └── 📄 api.ts
```

---

## 🔄 Data Flow

### Request Flow

```
1. User uploads photo (+ optional vibe)
              │
              ▼
2. Frontend sends POST /api/analyze
   - Content-Type: multipart/form-data
   - Body: { photo: File, vibe?: string }
              │
              ▼
3. Backend receives request
   - Validates image (size, type)
   - Converts to base64
              │
              ▼
4. ClaudeService analyzes image
   - Sends to Claude Vision API
   - Prompt includes vibe if provided
   - Returns: quote, mood, keywords
              │
              ▼
5. SpotifyService finds matching track
   - Searches using mood + keywords
   - Filters for tracks WITH preview_url
   - Returns: track name, artist, album art, preview URL
              │
              ▼
6. Backend returns VibeResponse
              │
              ▼
7. Frontend renders InstagramPreview
   - Displays photo with quote overlay
   - Plays 30-second audio preview
   - Shows share/download buttons
```

---

## 📋 API Contract

### POST /api/analyze

**Request:**
```http
POST /api/analyze
Content-Type: multipart/form-data

------boundary
Content-Disposition: form-data; name="photo"; filename="sunset.jpg"
Content-Type: image/jpeg

<binary data>
------boundary
Content-Disposition: form-data; name="vibe"

chill
------boundary--
```

**Response (200 OK):**
```json
{
  "quote": "Sometimes the best views come after the hardest climbs",
  "mood": "reflective",
  "hashtags": ["#sunset", "#vibes", "#peaceful"],
  "track": {
    "id": "3hRV0jL3vUpRrcy398teAU",
    "name": "Sunset Lover",
    "artist": "Petit Biscuit",
    "albumName": "Presence",
    "albumArt": "https://i.scdn.co/image/ab67616d0000b273...",
    "previewUrl": "https://p.scdn.co/mp3-preview/...",
    "spotifyUrl": "https://open.spotify.com/track/3hRV0jL3vUpRrcy398teAU",
    "durationMs": 30000
  }
}
```

**Error Response (400/500):**
```json
{
  "error": "Invalid image format",
  "code": "INVALID_IMAGE"
}
```

---

## 🔑 External Services

### Claude API (Anthropic)

| Item | Details |
|------|---------|
| Endpoint | `https://api.anthropic.com/v1/messages` |
| Model | `claude-sonnet-4-20250514` (vision capable) |
| Auth | API Key in header |
| Rate Limit | ~50 RPM on free tier |

### Spotify Web API

| Item | Details |
|------|---------|
| Auth | OAuth 2.0 Client Credentials Flow |
| Token Endpoint | `https://accounts.spotify.com/api/token` |
| Search Endpoint | `https://api.spotify.com/v1/search` |
| Rate Limit | ~100 requests/minute |

---

## ⚙️ Configuration

### appsettings.json
```json
{
  "Claude": {
    "ApiKey": "sk-ant-...",
    "Model": "claude-sonnet-4-20250514",
    "MaxTokens": 500
  },
  "Spotify": {
    "ClientId": "your-client-id",
    "ClientSecret": "your-client-secret"
  },
  "Upload": {
    "MaxFileSizeBytes": 10485760,
    "AllowedExtensions": [".jpg", ".jpeg", ".png", ".webp"]
  }
}
```

---

## 🎨 Frontend Components

### PhotoUpload
- Drag & drop zone
- File input fallback
- Image preview
- File validation (size, type)

### VibePicker (Optional)
- Preset vibe buttons: chill, energetic, romantic, moody, adventurous
- Custom text input option

### InstagramPreview
- Phone frame mockup
- Photo with quote overlay
- Gradient text shadow for readability
- Hashtag suggestions
- Audio player with visualizer

### AudioPlayer
- Play/pause 30-second preview
- Progress bar
- Track info display
- Link to Spotify

---

## 🚀 Deployment Options

| Platform | Frontend | Backend |
|----------|----------|---------|
| **Azure** | Static Web Apps | App Service / Container Apps |
| **GCP** | Cloud Storage + CDN | Cloud Run |
| **Vercel + Railway** | Vercel | Railway |
| **Fly.io** | Fly.io static | Fly.io |

**Recommended for MVP:** Vercel (frontend) + Railway (backend) - both have generous free tiers.

---

## 🔒 Security Considerations

1. **No photo storage** - Images processed in-memory only
2. **Rate limiting** - Prevent API abuse
3. **CORS** - Restrict to frontend domain
4. **API keys** - Use environment variables, never commit
5. **Input validation** - File size, type, dimensions

---

## 📊 Future Enhancements

- [ ] Multiple quote options to choose from
- [ ] Different Instagram formats (Story, Post, Reel)
- [ ] Save to device / direct Instagram share
- [ ] User accounts for history (optional)
- [ ] Premium tier with more generations
- [ ] Multiple music suggestions
- [ ] Custom fonts for quotes
