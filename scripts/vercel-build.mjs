// Vercel runs this instead of `build` (the `vercel-build` script takes precedence).
// Preview: fresh schema + seed on every build. Production: only pending migrations.
// Prod data must never end up in preview, so the destructive branch is guarded by VERCEL_ENV.
import { execSync } from 'node:child_process'

// NODE_ENV=production keeps the Postgres adapter out of push mode (it must never mix with migrations)
const run = (cmd) =>
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } })

if (process.env.VERCEL_ENV === 'preview') {
  run('pnpm payload migrate:fresh --force-accept-warning')
  run('pnpm seed')
} else {
  run('pnpm payload migrate')
}

run('pnpm build')
