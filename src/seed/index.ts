import config from '@payload-config';
import { getPayload } from 'payload';

import { seed } from '@/seed/seed';

const payload = await getPayload({ config });

try {
  await seed(payload);
  process.exit(0);
} catch (error) {
  payload.logger.error(error);
  process.exit(1);
}
