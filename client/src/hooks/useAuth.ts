import { useCallback, useEffect, useState } from 'react';
import type { AuthTokens } from '../api/auth';
import { authApi } from '../api/auth';

export type AuthState = 'idle' | 'loggedIn';

const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';

const decodeTokenPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const payload = decodeTokenPayload(token);
  const exp = payload?.exp;

  if (typeof exp !== 'number') {
    return true;
  }

  const currentUnixTime = Math.floor(Date.now() / 1000);
  return exp <= currentUnixTime;
};

const getStoredAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

const getStoredRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

const storeTokens = (tokens: AuthTokens) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>('idle');
  const [isLoading, setIsLoading] = useState(true);

  const refreshIfNeeded = useCallback(async () => {
    const accessToken = getStoredAccessToken();
    const refreshToken = getStoredRefreshToken();

    if (!accessToken || !refreshToken) {
      clearTokens();
      setAuthState('idle');
      return null;
    }

    if (!isTokenExpired(accessToken)) {
      setAuthState('loggedIn');
      return accessToken;
    }

    try {
      const refreshed = await authApi.refreshToken(refreshToken);
      storeTokens(refreshed);
      setAuthState('loggedIn');
      return refreshed.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearTokens();
      setAuthState('idle');
      return null;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      await refreshIfNeeded();
      setIsLoading(false);
    };

    checkAuth();
  }, [refreshIfNeeded]);

  useEffect(() => {
    const syncAuth = () => {
      void refreshIfNeeded();
    };

    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth-changed', syncAuth);

    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth-changed', syncAuth);
    };
  }, [refreshIfNeeded]);

  const handleAuthComplete = useCallback((tokens: AuthTokens) => {
    storeTokens(tokens);
    setAuthState('loggedIn');
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getStoredRefreshToken();

    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      clearTokens();
      setAuthState('idle');
    }
  }, []);

  return {
    authState,
    isLoading,
    handleAuthComplete,
    refreshIfNeeded,
    logout,
  };
};
