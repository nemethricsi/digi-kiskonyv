import type { Payload } from 'payload'

import { requireEnv } from '@/seed/requireEnv'

export async function ensureAdmin(payload: Payload) {
  const [email, password] = requireEnv('SEED_ADMIN_EMAIL', 'SEED_ADMIN_PASSWORD')

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    payload.logger.info(`Admin user already exists: ${email}`)
    return existing.docs[0]
  }

  const user = await payload.create({
    collection: 'users',
    data: { email, password },
  })
  payload.logger.info(`Admin user created: ${email}`)
  return user
}
