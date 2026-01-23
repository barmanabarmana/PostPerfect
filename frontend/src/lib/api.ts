import axios from 'axios';
import type { AnalyzeResponse } from '../types/api';

// Get API URL from runtime config (injected by Docker) or build-time env var or fallback to relative path
declare global {
  interface Window {
    ENV?: {
      VITE_API_URL?: string;
    };
  }
}

const getApiUrl = () => {
  // Priority: Runtime config > Build-time env > Relative path
  return window.ENV?.VITE_API_URL || import.meta.env.VITE_API_URL || '/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
});

export async function analyzePhoto(
  photo: File,
  vibe?: string,
  language?: string,
  hints?: string
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append('photo', photo);
  if (vibe) {
    formData.append('vibe', vibe);
  }
  if (language) {
    formData.append('language', language);
  }
  if (hints) {
    formData.append('hints', hints);
  }

  const response = await api.post<AnalyzeResponse>('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
