import axios from 'axios';
import type {
  AuthResponse,
  LoginPayload,
  RefreshTokenResponse,
  RegisterPayload,
} from '../shared/types/auth.model';

const api = axios.create({
  baseURL: '/auth',
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
      .then((response) => response.data as RefreshTokenResponse),

  logout: (refreshToken: string) =>
    api.post('/logout', undefined, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    }),
};
