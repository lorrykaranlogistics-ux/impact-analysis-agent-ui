import { z } from "zod";

export const changedFileSchema = z.object({
  filename: z.string(),
  status: z.string().optional(),
  additions: z.number().optional(),
  deletions: z.number().optional(),
});

export const serviceImpactSchema = z.object({
  serviceName: z.string(),
  impactLevel: z.string(),
  reason: z.string().optional(),
});

export const regressionAreaSchema = z.object({
  area: z.string(),
  risk: z.string(),
  description: z.string().optional(),
});

export const suggestedTestSchema = z.object({
  testName: z.string(),
  description: z.string(),
  type: z.string(),
});

export const sanityCheckResultSchema = z.object({
  checkName: z.string(),
  status: z.enum(["PASSED", "FAILED", "WARNING", "SKIPPED"]),
  message: z.string().optional(),
});

export const regressionTestResultsSchema = z.object({
  status: z.enum(["PASSED", "FAILED", "SKIPPED", "TIMEOUT"]),
  command: z.string(),
  summary: z.object({
    passed: z.number(),
    failed: z.number(),
    errors: z.number(),
    skipped: z.number(),
  }),
  durationSeconds: z.number(),
  outputSnippet: z.string(),
});

export const analysisResponseSchema = z.object({
  prNumber: z.number(),
  changedFiles: z.array(changedFileSchema),
  impactedServices: z.array(serviceImpactSchema),
  regressionAreas: z.array(regressionAreaSchema),
  suggestedTests: z.array(suggestedTestSchema),
  riskScore: z.number(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  confidence: z.number(),
  changeClassification: z.enum(["breakingChange", "schemaChange", "logicChange", "configChange", "unknown"]).optional(),
  dependencyDepth: z.number(),
  sanityCheckResults: z.array(sanityCheckResultSchema).optional(),
  regressionTestResults: regressionTestResultsSchema.optional(),
});

export const analyzePrRequestSchema = z.object({
  repo_url: z.string().url("Must be a valid URL"),
  pr_number: z.coerce.number().int().positive("Must be a positive integer"),
  use_llm: z.boolean().default(false),
  run_regression_tests: z.boolean().default(false),
  github_token: z.string().optional(),
});

export const loginRequestSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const loginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
export type AnalyzePrRequest = z.infer<typeof analyzePrRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
