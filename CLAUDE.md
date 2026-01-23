# PostPerfect - Complete Project Documentation

> **AI-powered Instagram post generator that analyzes photos to create authentic, mood-matching captions with hashtag suggestions**

## 🎯 Project Overview

PostPerfect is a **stateless web application** that transforms uploaded photos into Instagram-ready content. Using Claude AI's vision capabilities, it analyzes images to generate authentic captions that match the emotional tone and aesthetic of the photo, along with curated hashtag suggestions.

### Core Principles
- **Zero Data Storage**: Images are processed in-memory only, never saved to disk or database
- **Privacy-First**: No user accounts, no tracking, no persistent data
- **Authenticity**: AI generates modern, genuine captions that avoid clichés and influencer cringe
- **Multilingual Support**: Generates captions in 12+ languages

### Key Features
- **AI-Powered Analysis**: Claude Sonnet 4.5 with vision capabilities interprets image mood, aesthetic, and emotional context
- **Vibe Customization**: 13+ preset vibes including chill, energetic, romantic, nostalgic, philosophical, unhinged
- **Context Hints**: Users can provide keywords to personalize captions (names, occasions, relationships)
- **Language Selection**: Supports English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi
- **Instagram Preview**: Real-time preview of how the post will look
- **Rate Limiting**: IP-based rate limiting (10 requests/minute per user)

---

## 🏗️ Architecture

### Tech Stack

**Backend**
- Framework: ASP.NET Core 10 (Minimal API)
- Endpoint Pattern: FastEndpoints
- Language: C# 13
- AI Integration: Anthropic.SDK (Claude API)
- API Documentation: Scalar (Swagger alternative)
- Rate Limiting: Built-in ASP.NET Core RateLimiter

**Frontend**
- Core: React 19 + Vite 7
- Language: TypeScript 5.9
- Styling: Tailwind CSS 4
- Routing: React Router 7
- HTTP Client: Axios
- State Management: React Context API + Hooks

**Infrastructure**
- Deployment: Railway (both frontend and backend)
- Containerization: Docker
- Frontend Serving: Nginx (production)
- .NET Runtime: .NET 10.0 (nightly builds)

### Project Structure

```
PostPerfect/
├── PostPerfect.Api/                    # Backend API
│   ├── Program.cs                      # Application entry point, DI, middleware
│   ├── PostPerfect.Api.csproj          # Project file (.NET 10)
│   ├── appsettings.json                # Base configuration
│   ├── appsettings.Development.json    # Development secrets
│   ├── railway.json                    # Railway config
│   │
│   ├── Common/
│   │   └── Extensions/
│   │       └── ServiceCollectionExtensions.cs  # DI registration helpers
│   │
│   ├── Features/
│   │   └── Analyze/
│   │       ├── AnalyzeEndpoint.cs      # POST /api/analyze endpoint
│   │       ├── AnalyzeRequest.cs       # Input validation model
│   │       ├── AnalyzeResponse.cs      # API response model
│   │       └── AnalyzeValidator.cs     # FluentValidation rules
│   │
│   └── Services/
│       ├── Claude/
│       │   ├── IClaudeService.cs       # Service interface
│       │   ├── ClaudeService.cs        # Claude API integration
│       │   ├── ClaudeOptions.cs        # Configuration model
│       │   └── ClaudeAnalysisResult.cs # Claude response mapping
│       │
│       └── Spotify/                    # ⚠️ DISABLED (API access revoked)
│           ├── ISpotifyService.cs
│           ├── SpotifyService.cs
│           ├── SpotifyOptions.cs
│           └── SpotifyTrack.cs
│
├── frontend/                           # Frontend application
│   ├── Dockerfile                      # Multi-stage: build + nginx
│   ├── docker-entrypoint.sh            # Runtime env var injection
│   ├── nginx.conf                      # Production server config
│   ├── package.json                    # Dependencies
│   ├── railway.json                    # Railway config
│   │
│   ├── src/
│   │   ├── main.tsx                    # React entry point
│   │   ├── App.tsx                     # Root component with routing
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.tsx                # Main upload/analysis page
│   │   │   ├── FAQ.tsx                 # Frequently asked questions
│   │   │   ├── Privacy.tsx             # Privacy policy
│   │   │   └── Terms.tsx               # Terms of service
│   │   │
│   │   ├── components/
│   │   │   ├── PhotoUpload.tsx         # Drag-and-drop image uploader
│   │   │   ├── VibePicker.tsx          # Vibe selection UI
│   │   │   ├── HintsInput.tsx          # Context keywords input
│   │   │   ├── LanguagePicker.tsx      # Language selection dropdown
│   │   │   ├── InstagramPreview.tsx    # Phone mockup with preview
│   │   │   ├── LoadingSpinner.tsx      # Analysis loading state
│   │   │   ├── AudioPlayer.tsx         # ⚠️ DISABLED (Spotify removed)
│   │   │   └── Footer.tsx              # Site footer
│   │   │
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx        # Dark/light mode state
│   │   │
│   │   ├── hooks/
│   │   │   └── useAnalyze.ts           # API call hook
│   │   │
│   │   ├── lib/
│   │   │   └── api.ts                  # Axios configuration
│   │   │
│   │   └── types/
│   │       └── api.ts                  # TypeScript API types
│   │
│   └── public/                         # Static assets
│
├── Dockerfile.backend                  # Backend Docker config
├── PostPerfect.sln                     # .NET solution file
├── .gitignore
│
└── Documentation/
    ├── README.md                       # Quick start guide
    ├── CLAUDE.md                       # This file
    ├── PostPerfect-Architecture.md     # Original architecture doc
    ├── RAILWAY-DEPLOYMENT.md           # Railway deployment guide
    ├── FRONTEND-SETUP.md               # Frontend setup instructions
    └── SECURITY-SETUP.md               # API key configuration guide
```

---

## 🔄 Data Flow

### Request Flow Diagram

```
User Uploads Photo + Options
         ↓
Frontend (React)
  - Validates file (size, type)
  - Collects vibe, language, hints
         ↓
POST /api/analyze
  - Content-Type: multipart/form-data
  - Body: { photo: File, vibe?: string, language?: string, hints?: string }
         ↓
AnalyzeEndpoint
  - FastEndpoints validation
  - Rate limiting check (10/min per IP)
  - Convert image to byte array
         ↓
ClaudeService.AnalyzeImageAsync()
  - Convert image to base64
  - Build comprehensive analysis prompt
  - Include vibe instructions if specified
  - Set language for caption generation
  - Add context hints if provided
  - Include variation seed for uniqueness
         ↓
Claude API (Anthropic)
  - Model: claude-sonnet-4-20250514
  - Vision analysis of image
  - Deep emotional and aesthetic read
  - Caption generation in target language
         ↓
ClaudeService
  - Parse JSON response
  - Extract: quote, mood, hashtags, musicKeywords
         ↓
AnalyzeEndpoint
  - Map to AnalyzeResponse
  - Return to frontend
         ↓
Frontend
  - Display in InstagramPreview component
  - Show quote overlay on image
  - Display mood + hashtags
  - Allow copy/download
```

---

## 📋 API Specification

### POST /api/analyze

Analyzes an uploaded image and generates Instagram content.

**Request:**
```http
POST /api/analyze
Content-Type: multipart/form-data

Form Fields:
  photo: File (required)
    - Allowed types: image/jpeg, image/png, image/webp
    - Max size: 10MB

  vibe: string (optional)
    - Single value or comma-separated list
    - Examples: "chill", "nostalgic,romantic", "philosophical"

  language: string (optional)
    - ISO 639-1 language code
    - Default: "en"
    - Supported: en, es, fr, de, it, pt, ru, ja, ko, zh, ar, hi

  hints: string (optional)
    - Context keywords to personalize caption
    - Example: "birthday party with Sarah, celebrating 25th"
```

**Response (200 OK):**
```json
{
  "quote": "as camus said, the only way to deal with an unfree world is to become so absolutely free",
  "mood": "contemplative",
  "hashtags": ["#existentialism", "#solitude", "#introspection", "#philosophy", "#authentic"]
}
```

**Error Responses:**

```json
// 400 Bad Request - Invalid file
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Photo": ["File size exceeds 10MB limit"]
  }
}

// 429 Too Many Requests - Rate limit exceeded
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.29",
  "title": "Too Many Requests",
  "status": 429,
  "detail": "Rate limit exceeded. Please try again later."
}

// 500 Internal Server Error - AI processing failure
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.6.1",
  "title": "An error occurred while processing your request.",
  "status": 500
}
```

---

## 🤖 AI Prompt Engineering

### Claude Analysis Prompt Structure

The prompt sent to Claude is highly structured to ensure consistent, high-quality outputs:

#### Phase 1: Deep Image Analysis (Internal Processing)
- **Visual Content**: Subject matter, composition, color palette, lighting
- **Emotional Read**: Facial expressions, body language, energy
- **Content Context**: Niche, aesthetic, vibe
- **Engagement Factors**: Scroll-stopping elements, relatability

#### Phase 2: Caption Creation
- **Voice Guidelines**: Authentic modern voice (deadpan, self-aware, understated)
- **Anti-Patterns**: Avoids inspirational clichés, emoji spam, influencer energy
- **Caption Styles**: 10 distinct styles (cryptic, absurdist, nostalgic, mysterious, etc.)

#### Phase 3: JSON Output
Returns structured data:
```json
{
  "quote": "Caption text (max 150 chars)",
  "mood": "single evocative word",
  "hashtags": ["#niche", "#specific", "#aesthetic"],
  "musicKeywords": ["genre", "descriptor", "vibe"]
}
```

### Vibe Instruction System

The prompt dynamically adapts based on selected vibe(s):

- **Philosophical**: Incorporates quotes from known thinkers (Camus, Nietzsche, Marcus Aurelius, etc.)
- **Nostalgic**: Uses varied nostalgic vocabulary, avoids overusing "remember"
- **Multi-Vibe**: Seamlessly blends multiple requested vibes into cohesive caption
- **Auto**: AI determines mood naturally from image

### Variation System

Each request includes a unique GUID seed to ensure caption variation across multiple generations of the same image.

---

## ⚙️ Configuration

### Backend Environment Variables

```bash
# Required
ASPNETCORE_ENVIRONMENT=Production
Claude__ApiKey=sk-ant-api03-xxxxx
Claude__Model=claude-sonnet-4-20250514
Claude__MaxTokens=500

# CORS
FrontendUrl=https://your-frontend.railway.app

# Optional (defaults in appsettings.json)
Upload__MaxFileSizeBytes=10485760
Upload__AllowedContentTypes=["image/jpeg","image/png","image/webp"]
```

### Frontend Environment Variables

```bash
# Required
VITE_API_URL=https://your-backend.railway.app/api
```

### appsettings.json

```json
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
  "Upload": {
    "MaxFileSizeBytes": 10485760,
    "AllowedContentTypes": ["image/jpeg", "image/png", "image/webp"]
  }
}
```

---

## 🚀 Development Setup

### Prerequisites
- .NET 10 SDK (preview)
- Node.js 20+ with npm
- Anthropic Claude API key

### Backend Setup

```bash
# Navigate to API directory
cd PostPerfect.Api

# Create development settings (copy from example)
cp appsettings.Development.json.example appsettings.Development.json

# Edit and add your Claude API key
# appsettings.Development.json:
{
  "Claude": {
    "ApiKey": "sk-ant-api03-your-key-here"
  }
}

# Restore dependencies
dotnet restore

# Run backend (listens on http://localhost:5000)
dotnet run
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (copy from example)
cp .env.example .env

# Edit .env:
VITE_API_URL=http://localhost:5000/api

# Run development server (http://localhost:5173)
npm run dev
```

### Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/scalar/v1 (development only)

---

## 🐳 Docker Deployment

### Backend Dockerfile

Located at: `Dockerfile.backend`

```dockerfile
# Build stage with .NET 10 SDK
FROM mcr.microsoft.com/dotnet/nightly/sdk:10.0 AS build
WORKDIR /src
COPY PostPerfect.Api/PostPerfect.Api.csproj PostPerfect.Api/
RUN dotnet restore "PostPerfect.Api/PostPerfect.Api.csproj"
COPY PostPerfect.Api/ PostPerfect.Api/
WORKDIR /src/PostPerfect.Api
RUN dotnet build "PostPerfect.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "PostPerfect.Api.csproj" -c Release -o /app/publish

# Runtime stage with .NET 10 ASP.NET runtime
FROM mcr.microsoft.com/dotnet/nightly/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
CMD /bin/sh -c "dotnet PostPerfect.Api.dll --urls http://0.0.0.0:${PORT:-8080}"
```

### Frontend Dockerfile

Located at: `frontend/Dockerfile`

Multi-stage build with Vite + Nginx:
1. **Build stage**: Compiles TypeScript, bundles assets
2. **Runtime stage**: Serves static files with Nginx
3. **Entrypoint script**: Injects runtime environment variables

---

## 🚂 Railway Deployment

### Current Deployment Status

**Backend**: `https://postperfect-api.railway.app`
**Frontend**: `https://postperfect.railway.app`

### Deployment Configuration

**Backend Service (`railway.json`)**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile.backend"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Frontend Service (`railway.json`)**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Environment Variables (Railway)

**Backend Variables:**
- `ASPNETCORE_ENVIRONMENT` = Production
- `Claude__ApiKey` = [Your Claude API key]
- `Claude__Model` = claude-sonnet-4-20250514
- `Claude__MaxTokens` = 500
- `FrontendUrl` = https://postperfect.railway.app

**Frontend Variables:**
- `VITE_API_URL` = https://postperfect-api.railway.app/api

---

## 🔒 Security & Privacy

### Data Handling
- **No Persistence**: Images are processed in-memory, never written to disk
- **No Database**: Zero data storage, completely stateless
- **No Tracking**: No analytics, cookies, or user tracking
- **No Accounts**: Anonymous usage, no authentication required

### Rate Limiting
```csharp
// Per-IP rate limiting: 10 requests per minute
options.AddPolicy("PerUserLimit", httpContext =>
    RateLimitPartition.GetFixedWindowLimiter(
        partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        factory: _ => new FixedWindowRateLimiterOptions {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1)
        }));
```

### CORS Configuration
```csharp
// Only allows requests from configured frontend URL
policy.WithOrigins(allowedOrigins.ToArray())
      .AllowAnyHeader()
      .AllowAnyMethod();
```

### Input Validation
- File size limit: 10MB
- Allowed types: JPEG, PNG, WebP
- File content type verification
- FastEndpoints automatic validation

---

## 📊 Performance & Monitoring

### Backend Performance
- **Cold Start**: ~2-3 seconds (Railway)
- **Warm Request**: ~3-5 seconds (Claude API processing)
- **Rate Limit**: 10 req/min per IP
- **Max Upload**: 10MB

### Claude API Usage
- **Model**: claude-sonnet-4-20250514
- **Tokens per Request**: ~300-500 tokens
- **Cost per Request**: ~$0.003 (varies by image size)

### Frontend Performance
- **Bundle Size**: ~250KB (gzipped)
- **Lighthouse Score**: 90+ (Performance)
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <2s

---

## 🐛 Known Issues & Limitations

### Current Issues

1. **Spotify Integration Disabled**
   - Status: ⚠️ TEMPORARILY DISABLED
   - Reason: Spotify API access closed for new applications
   - Code: Commented out but preserved for future re-enabling
   - Affected: Music recommendations feature

2. **NUL File Generation (IDEA)**
   - Issue: IntelliJ IDEA creates `nul` files in project root
   - Workaround: Delete `.idea` directory and `nul` file with admin privileges
   - Status: Unresolved (IDE-specific bug)

### Limitations

- **Caption Length**: Max 150 characters (enforced by prompt)
- **Image Size**: 10MB limit
- **Languages**: 12 supported (expandable)
- **Rate Limiting**: 10 requests/minute per IP
- **No Batch Processing**: One image at a time

---

## 🛠️ Development Guidelines

### Code Style

**Backend (C#)**
- Follow ASP.NET Core conventions
- Use FastEndpoints for endpoint definitions
- Dependency Injection for all services
- Async/await for all I/O operations

**Frontend (TypeScript/React)**
- Functional components with hooks
- TypeScript strict mode enabled
- Tailwind CSS for styling (utility-first)
- ESLint + TypeScript ESLint for linting

### Adding New Features

**New Vibe Type:**
1. Update `ClaudeService.GenerateVibeInstruction()` (PostPerfect.Api/Services/Claude/ClaudeService.cs:219)
2. Add vibe button to `VibePicker.tsx` (frontend/src/components/VibePicker.tsx)

**New Language:**
1. Add language code to `languageMap` (PostPerfect.Api/Services/Claude/ClaudeService.cs:42)
2. Add language option to `LanguagePicker.tsx` (frontend/src/components/LanguagePicker.tsx)

**New Endpoint:**
1. Create feature folder under `Features/`
2. Implement endpoint inheriting `Endpoint<TRequest, TResponse>`
3. Register with `AddFastEndpoints()` (auto-discovered)

---

## 📚 Related Documentation

- **README.md**: Quick start and basic overview
- **RAILWAY-DEPLOYMENT.md**: Step-by-step Railway deployment guide
- **FRONTEND-SETUP.md**: Detailed frontend setup instructions
- **SECURITY-SETUP.md**: API key configuration guide
- **PostPerfect-Architecture.md**: Original architecture documentation

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Re-enable Spotify integration when API access available
- [ ] Multiple caption variations per image
- [ ] Instagram Story format support
- [ ] Direct Instagram sharing integration
- [ ] Caption history (optional, user-controlled)
- [ ] Custom vibe creation
- [ ] Image filters/editing before analysis
- [ ] Batch image processing
- [ ] Progressive Web App (PWA) support

### Technical Improvements
- [ ] Redis caching for repeated image analysis
- [ ] CDN integration for faster asset delivery
- [ ] Webhook support for async processing
- [ ] GraphQL API alternative
- [ ] WebSocket support for real-time updates
- [ ] E2E testing with Playwright
- [ ] Load testing with k6

---

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Workflow
1. Ensure backend and frontend run locally
2. Test changes thoroughly
3. Update documentation if needed
4. Ensure no ESLint/compiler warnings
5. Follow existing code style

---

## 📞 Support & Contact

- **Issues**: GitHub Issues
- **Documentation**: This file + related MD files
- **API Key**: Get from [Anthropic Console](https://console.anthropic.com/)

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🏷️ Version Information

- **Backend**: .NET 10.0 (nightly builds)
- **Frontend**: React 19 + Vite 7
- **Claude Model**: claude-sonnet-4-20250514
- **Current Version**: 0.1.0 (MVP)
- **Last Updated**: January 2026

---

**Built with ❤️ using Claude AI**
