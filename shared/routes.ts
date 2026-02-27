import { z } from 'zod';
import { 
  loginRequestSchema, 
  loginResponseSchema, 
  analyzePrRequestSchema, 
  analysisResponseSchema 
} from './schema';

export const errorSchemas = {
  validation: z.object({
    detail: z.any()
  }),
  unauthorized: z.object({
    detail: z.any()
  }),
  generic: z.object({
    detail: z.any()
  })
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/auth/login' as const,
      input: loginRequestSchema,
      responses: {
        200: loginResponseSchema,
        401: errorSchemas.unauthorized,
      },
    },
  },
  health: {
    check: {
      method: 'GET' as const,
      path: '/health' as const,
      responses: {
        200: z.object({ status: z.string() }),
      },
    }
  },
  analysis: {
    analyze: {
      method: 'POST' as const,
      path: '/analyze-pr' as const,
      input: analyzePrRequestSchema,
      responses: {
        200: analysisResponseSchema,
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        429: errorSchemas.generic,
        500: errorSchemas.generic,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
