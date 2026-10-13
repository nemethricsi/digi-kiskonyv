import { createEnv } from '@t3-oss/env-nextjs'
import * as z from 'zod'

// Separate from src/env.ts: only the seed needs these (locally and on Vercel preview)
export const seedEnv = createEnv({
  server: {
    SEED_ADMIN_EMAIL: z.email().endsWith('@example.com'),
    SEED_ADMIN_PASSWORD: z.string().min(8),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
