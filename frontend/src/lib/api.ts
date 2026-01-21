import axios from 'axios';
import type { AnalyzeResponse } from '../types/api';

const api = axios.create({
  baseURL: '/api',
});

export async function analyzePhoto(
  photo: File,
  vibe?: string,
  language?: string
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append('photo', photo);
  if (vibe) {
    formData.append('vibe', vibe);
  }
  if (language) {
    formData.append('language', language);
  }

  const response = await api.post<AnalyzeResponse>('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
