import { useCallback, useEffect, useState } from 'react';
import { authApi } from '../api/auth';
import type { AuthTokens } from '../shared/types/auth.model';
import {
  clearTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  isTokenExpired,
  storeTokens,
} from '../shared/utils/authToken';

export type AuthState = 'idle' | 'loggedIn';

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
      window.dispatchEvent(new Event('auth-changed'));
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
