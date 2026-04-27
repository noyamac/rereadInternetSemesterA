import axios, { type InternalAxiosRequestConfig } from 'axios';
import { getStoredAccessToken } from '../shared/utils/authToken';
import type { UserProfile } from '../shared/types/user.model';

const BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${BASE_URL}/user`,
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

export interface UpdateUserPayload {
  username: string;
  profilePicture?: string;
}

export const userApi = {
  getUser: (userId: string) => api.get(`/${userId}`).then((r) => r.data),

  updateUser: (userId: string, payload: UpdateUserPayload) =>
    api.put(`/${userId}`, payload).then((r) => r.data as UserProfile),
};
