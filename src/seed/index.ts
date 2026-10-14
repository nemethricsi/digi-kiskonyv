import config from '@payload-config';
import { getPayload } from 'payload';

import { ensureAdmin } from '@/seed/admin';
import { ensureDemoCitizen } from '@/seed/citizen';

const payload = await getPayload({ config });

try {
  await ensureAdmin(payload);
  await ensureDemoCitizen(payload);
  process.exit(0);
} catch (error) {
  payload.logger.error(error);
  process.exit(1);
}
