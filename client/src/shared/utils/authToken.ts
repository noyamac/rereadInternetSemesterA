import type { AuthTokens } from '../types/auth.model';

const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';

export const decodeTokenPayload = (
  token: string,
): Record<string, unknown> | null => {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return null;
    return JSON.parse(atob(payloadPart));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeTokenPayload(token);
  const exp = payload?.exp;

  if (typeof exp !== 'number') {
    return true;
  }

  const currentUnixTime = Math.floor(Date.now() / 1000);
  return exp <= currentUnixTime;
};

export const getStoredAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const getStoredRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const storeTokens = (tokens: AuthTokens) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeTokenPayload(token);
  return typeof payload?.userId === 'string' ? payload.userId : null;
};

export const getUserIdFromStoredAccessToken = (): string | null => {
  const token = getStoredAccessToken();
  if (!token) return null;
  return getUserIdFromToken(token);
};
