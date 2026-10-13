import type { Payload } from 'payload'

export async function ensureAdmin(payload: Payload) {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set')
  }

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
