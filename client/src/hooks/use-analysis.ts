import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { api as routesApi } from '@shared/routes';
import { type AnalyzePrRequest, type AnalysisResponse } from '@shared/schema';

const CACHE_KEY = 'last_analysis_result';

export function useAnalysis() {
  const queryClient = useQueryClient();

  const { data: cachedResult } = useQuery<AnalysisResponse | null>({
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
    staleTime: Infinity,
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: AnalyzePrRequest) => {
      const res = await api.post<AnalysisResponse>(routesApi.analysis.analyze.path, data);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      queryClient.setQueryData(['lastAnalysis'], data);
    },
  });

  return {
    analyze: analyzeMutation.mutate,
    analyzeAsync: analyzeMutation.mutateAsync,
    isAnalyzing: analyzeMutation.isPending,
    result: analyzeMutation.data || cachedResult,
    error: analyzeMutation.error,
    clearResult: () => {
      localStorage.removeItem(CACHE_KEY);
      queryClient.setQueryData(['lastAnalysis'], null);
    },
  };
}
