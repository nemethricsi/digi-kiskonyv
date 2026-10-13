import type { Payload } from 'payload'

import { seedEnv } from '@/seed/env'

export async function ensureAdmin(payload: Payload) {
  const { SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: password } = seedEnv

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
