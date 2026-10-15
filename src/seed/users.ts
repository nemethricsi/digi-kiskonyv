import { seedEnv } from '@/seed/env';

import type { Role } from '@/lib/roles';
import type { Payload, PayloadRequest } from 'payload';

const DEMO_ADMIN_EMAIL = 'admin@example.com';
const DEMO_CLERK_EMAIL = 'clerk@example.com';

type SeedUser = { email: string; password: string; role: Role };

async function ensureUser(
  payload: Payload,
  { email, password, role }: SeedUser,
  req?: Partial<PayloadRequest>,
) {
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    req,
  });

  if (existing.docs.length > 0) {
    payload.logger.info(`User already exists: ${email}`);
    return existing.docs[0];
  }

  const user = await payload.create({
    collection: 'users',
    data: { email, password, role },
    req,
  });
  payload.logger.info(`User created: ${email} (${role})`);
  return user;
}

export function ensureAdmin(payload: Payload, req?: Partial<PayloadRequest>) {
  return ensureUser(
    payload,
    {
      email: DEMO_ADMIN_EMAIL,
      password: seedEnv.SEED_ADMIN_PASSWORD,
      role: 'admin',
    },
    req,
  );
}

export function ensureClerk(payload: Payload, req?: Partial<PayloadRequest>) {
  return ensureUser(
    payload,
    {
      email: DEMO_CLERK_EMAIL,
      password: seedEnv.SEED_CLERK_PASSWORD,
      role: 'clerk',
    },
    req,
  );
}
