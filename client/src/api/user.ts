import axios, { type InternalAxiosRequestConfig } from 'axios';
import { getStoredAccessToken } from '../shared/utils/authToken';

const api = axios.create({
  baseURL: '/user',
  headers: { 'Content-Type': 'application/json' },
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

export const userApi = {
  getUser: (userId: string) => api.get(`/${userId}`).then((r) => r.data),
};
