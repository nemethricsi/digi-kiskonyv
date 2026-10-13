import { createEnv } from '@t3-oss/env-nextjs'
import * as z from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    PAYLOAD_SECRET: z.string().min(32),
    // Mailpit locally; unset on Vercel preview, where Payload logs emails to the console
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().default(1025),
    // Vercel system env vars, absent locally
    VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
    VERCEL_URL: z.string().optional(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.url().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },
  emptyStringAsUndefined: true,
  // Escape hatch for commands that load the config without a full env (e.g. generate:types in CI)
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
