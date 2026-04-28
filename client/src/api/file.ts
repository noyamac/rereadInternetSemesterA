import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { getStoredAccessToken } from '../shared/utils/authToken';

const BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${BASE_URL}/file`,
});

const attachAuthToken = (config: InternalAxiosRequestConfig) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachAuthToken);

type UploadResponse = {
  url: string;
};

export const fileApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api
      .post<UploadResponse>('/', formData, {
        headers: {
          'Content-Type': file.type || 'image/jpeg',
        },
      })
      .then((response) => ({ url: response.data.url }));
  },
};
