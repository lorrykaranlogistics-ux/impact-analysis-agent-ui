import axios from 'axios';
import { toast } from '@/hooks/use-toast';

// Create Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('access_token');
        // Avoid redirect loop if already on login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // Parse structured error from backend (assuming { detail: { message: string, code: string } } or similar)
      const data = error.response.data;
      let errorMessage = 'An unexpected error occurred';
      
      if (data?.detail) {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (data.detail.message) {
          errorMessage = data.detail.message;
        } else if (Array.isArray(data.detail)) {
          // Handle FastAPI/Pydantic validation errors
          errorMessage = data.detail.map((err: any) => `${err.loc?.join('.')} - ${err.msg}`).join(', ');
        }
      }

      // We don't want to toast 401s if we're redirecting anyway to avoid noise
      if (error.response.status !== 401) {
        toast({
          title: `Error ${error.response.status}`,
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } else if (error.request) {
      toast({
        title: 'Network Error',
        description: 'Could not connect to the server. Please check your connection.',
        variant: 'destructive',
      });
    }
    
    return Promise.reject(error);
  }
);
