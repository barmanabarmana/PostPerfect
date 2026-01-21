import axios from 'axios';
import type { AnalyzeResponse } from '../types/api';

// Use environment variable for API URL, fallback to relative path for local development
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
