import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

// Separate from src/env.ts: only the seed needs these (locally, on Vercel preview, and in
// production when the demo reset is enabled). Only the passwords: the emails are fixed in users.ts.
export const seedEnv = createEnv({
  server: {
    // admin@example.com
    SEED_ADMIN_PASSWORD: z.string().min(8),
    // clerk@example.com, the demo Ügyintéző
    SEED_CLERK_PASSWORD: z.string().min(8),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
