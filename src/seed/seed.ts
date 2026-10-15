import { ensureDemoCitizen } from '@/seed/citizen';
import { ensureAdmin, ensureClerk } from '@/seed/users';

import type { Payload, PayloadRequest } from 'payload';

// Shared by `pnpm seed` and the demo reset. Pass `req` to run inside an open transaction.
export async function seed(payload: Payload, req?: Partial<PayloadRequest>) {
  await ensureAdmin(payload, req);
  await ensureClerk(payload, req);
  await ensureDemoCitizen(payload, req);
}
