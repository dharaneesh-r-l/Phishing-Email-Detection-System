
import { z } from 'zod';
import { insertScanSchema, scans } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  scans: {
    analyze: {
      method: 'POST' as const,
      path: '/api/analyze' as const,
      input: z.object({
        content: z.string().min(1, "Email content is required"),
      }),
      responses: {
        200: z.custom<typeof scans.$inferSelect>(),
        500: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/scans' as const,
      responses: {
        200: z.array(z.custom<typeof scans.$inferSelect>()),
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
