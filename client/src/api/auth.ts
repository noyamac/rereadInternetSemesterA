import axios from 'axios';
import type {
  AuthResponse,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
} from '../shared/types/auth.model';

const BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${BASE_URL}/auth`,
  headers: { 'Content-Type': 'application/json' },
});

export const authApi = {
  login: (formData: LoginPayload) =>
    api
      .post('/login', formData)
      .then((response) => response.data as AuthResponse),

  register: (formData: RegisterPayload) =>
    api
      .post('/register', formData)
      .then((response) => response.data as AuthResponse),

  refreshToken: (refreshToken: string) =>
    api
      .post('/refresh-token', { refreshToken })
      .then((response) => response.data as AuthTokens),

  logout: (refreshToken: string) =>
    api.post('/logout', undefined, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    }),

  googleLogin: (credential: string) =>
    api
      .post('/google-login', { credential })
      .then((response) => response.data as AuthResponse),
};
