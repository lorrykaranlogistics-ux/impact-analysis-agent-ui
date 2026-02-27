import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { api as routesApi } from '@shared/routes';
import { type LoginRequest, type LoginResponse } from '@shared/schema';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('access_token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('access_token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const res = await api.post<LoginResponse>(routesApi.auth.login.path, credentials);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      setIsAuthenticated(true);
    },
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('last_analysis_result'); // Clear sensitive cached data
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return {
    isAuthenticated,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout,
  };
}
