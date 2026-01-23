# CaptionIT 📸✨

**Turn your photos into Instagram-ready posts with AI.**

CaptionIT is a completely stateless web application that analyzes uploaded photos to generate matching quotes, moods, hashtags recommendations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-development-orange)
![.NET](https://img.shields.io/badge/.NET-10.0-purple)
![React](https://img.shields.io/badge/react-18.0-blue)

## 📖 Overview

CaptionIT operates on a **stateless** core principle: no database, no photo storage, and everything is processed in-memory. The application uses Claude AI to "see" your image and interpret its vibe.

### Key Features
* **AI Analysis:** Uses Anthropic Claude to determine mood and generate Instagram-worthy quotes.
* **Vibe Picker:** Optional manual vibe selection (Chill, Energetic, Romantic, etc.).
* **Instagram Preview:** Visualizes how the post will look with the generated content.
* **Privacy First:** Images are processed in-memory and never saved to a disk or database.

## 🛠 Tech Stack

### Backend
* **Framework:** ASP.NET Core 10 Minimal API
* **Endpoints:** FastEndpoints
* **Language:** C# 13
* **AI:** Anthropic Claude API
* **Music:** Spotify Web API

### Frontend
* **Core:** React 18 + Vite + TypeScript
* **Styling:** Tailwind CSS
* **State:** React Hooks

## 🚀 Getting Started
### 1. Clone the Repository
```
https://github.com/barmanabarmana/CaptionIT.git
```
### 2. Backend Setup
Navigate to the API directory and configure your user secrets or development settings.
```
cd src/CaptionIT.Api
```
Open appsettings.Development.json and add your keys:

Run the backend:
```
dotnet run
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory.
```
cd frontend
npm install
```
Run the frontend development server:
```
npm run dev
# The UI will be available at http://localhost:5173
```
