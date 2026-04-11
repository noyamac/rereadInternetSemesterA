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
