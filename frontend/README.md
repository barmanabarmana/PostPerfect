# PostPerfect Frontend

Modern, minimalistic, and reactive React frontend for PostPerfect - Turn your photos into Instagram-ready posts with AI.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Axios** for API communication

## Features

- 📸 Drag & drop photo upload
- 🎨 Optional vibe selection (Chill, Energetic, Romantic, etc.)
- 🤖 AI-powered quote generation
- 🎵 Spotify music recommendations with 30s preview
- 📱 Instagram-style phone frame preview
- ⚡ Fast and reactive UI

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── PhotoUpload.tsx
│   ├── VibePicker.tsx
│   ├── LoadingSpinner.tsx
│   ├── AudioPlayer.tsx
│   └── InstagramPreview.tsx
├── hooks/              # Custom React hooks
│   └── useAnalyze.ts
├── lib/                # API client
│   └── api.ts
├── types/              # TypeScript types
│   └── api.ts
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## API Configuration

The frontend proxies API requests to `http://localhost:5000` (configured in `vite.config.ts`).

Make sure the PostPerfect.Api backend is running on port 5000.

## Design Features

- **Modern UI**: Clean, minimalistic design with gradient backgrounds
- **Reactive**: Smooth transitions and hover effects
- **Responsive**: Works on various screen sizes
- **Accessible**: Semantic HTML and ARIA labels
- **Instagram-inspired**: Phone frame mockup for post preview
