import { getPayload } from 'payload';

import config from '@/payload.config';

/**
 * Mock sign-in: the latest citizen plays the signed-in user. Uses the Local API with the default
 * overrideAccess, so the citizens collection stays closed on the REST/GraphQL API.
 * With real auth this becomes `payload.auth({ headers })` → `user`.
 */
export async function getDemoCitizen() {
  const payload = await getPayload({ config });

  const {
    docs: [citizen],
  } = await payload.find({
    collection: 'citizens',
    limit: 1,
    sort: '-createdAt',
  });

  return citizen;
}
