import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { api as routesApi } from '@shared/routes';
import { type AnalyzePrRequest, type AnalysisResponse } from '@shared/schema';

const CACHE_KEY = 'last_analysis_result';

export function useAnalysis() {
  // Query to load cached result on mount
  const { data: cachedResult, setData: setCachedResult } = useQuery<AnalysisResponse | null>({
    queryKey: ['lastAnalysis'],
    queryFn: () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached) as AnalysisResponse;
        } catch {
          localStorage.removeItem(CACHE_KEY);
        }
      }
      return null;
    },
    staleTime: Infinity, // Don't refetch automatically
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: AnalyzePrRequest) => {
      const res = await api.post<AnalysisResponse>(routesApi.analysis.analyze.path, data);
      return res.data;
    },
    onSuccess: (data) => {
      // Cache the successful result
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      // Update the local query cache to reflect immediately without reload
      useQueryClient().setQueryData(['lastAnalysis'], data);
    },
  });

  // Helper hook to get query client since we can't call it conditionally above
  const useQueryClientRef = () => {
    return useQueryClient();
  };

  return {
    analyze: analyzeMutation.mutate,
    analyzeAsync: analyzeMutation.mutateAsync,
    isAnalyzing: analyzeMutation.isPending,
    result: analyzeMutation.data || cachedResult,
    error: analyzeMutation.error,
    clearResult: () => {
      localStorage.removeItem(CACHE_KEY);
      // Need to find a way to invalidate, usually done via queryClient
    }
  };
}

// Separate hook just for the queryClient to avoid React Hook rules violations in returns
import { useQueryClient } from '@tanstack/react-query';
