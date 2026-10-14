'use server';

import { revalidatePath } from 'next/cache';
import { getPayload } from 'payload';

import { getDemoCitizen } from '@/app/(frontend)/dap/me/demo-citizen';
import { ACTIVE_REGISTRATION_STATUSES } from '@/lib/registration-status';
import config from '@/payload.config';

export type SubmitRegistrationResult =
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function submitRegistration(): Promise<SubmitRegistrationResult> {
  // The citizen comes from the (mock) session on the server, never from the client
  const citizen = await getDemoCitizen();
  if (!citizen) {
    return { status: 'error', message: 'Nincs bejelentkezett állampolgár.' };
  }

  const payload = await getPayload({ config });

  const { totalDocs: activeCount } = await payload.count({
    collection: 'registrations',
    where: {
      citizen: { equals: citizen.id },
      status: { in: [...ACTIVE_REGISTRATION_STATUSES] },
    },
  });
  if (activeCount > 0) {
    return { status: 'error', message: 'Már van folyamatban lévő kérelme.' };
  }

  await payload.create({
    collection: 'registrations',
    data: {
      citizen: citizen.id,
      status: 'requested',
      requestedAt: new Date().toISOString(),
    },
  });

  revalidatePath('/dap/me');
  return { status: 'success' };
}
