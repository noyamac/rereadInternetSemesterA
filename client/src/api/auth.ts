import axios from 'axios';

const api = axios.create({
  baseURL: '/auth',
  headers: { 'Content-Type': 'application/json' },
});

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  username: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

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
