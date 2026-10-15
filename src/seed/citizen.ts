import type { Payload, PayloadRequest } from 'payload';

// Fictional demo citizen, the one the mock DÁP sign-in (/dap/me) shows
const DEMO_CITIZEN = {
  name: 'Gipsz Jakab',
  placeOfBirth: 'Budapest',
  dateOfBirth: '1990-01-01T12:00:00.000Z',
  nameOfMother: 'Gipsz Jakabné',
  taj: '123456788',
};

export async function ensureDemoCitizen(
  payload: Payload,
  req?: Partial<PayloadRequest>,
) {
  const existing = await payload.find({
    collection: 'citizens',
    where: { taj: { equals: DEMO_CITIZEN.taj } },
    limit: 1,
    req,
  });

  if (existing.docs.length > 0) {
    payload.logger.info(`Demo citizen already exists: ${DEMO_CITIZEN.name}`);
    return existing.docs[0];
  }

  const citizen = await payload.create({
    collection: 'citizens',
    data: DEMO_CITIZEN,
    req,
  });
  payload.logger.info(`Demo citizen created: ${DEMO_CITIZEN.name}`);
  return citizen;
}
