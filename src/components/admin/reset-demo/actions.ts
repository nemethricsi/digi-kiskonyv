'use server';

import { headers } from 'next/headers';

import { getPayload } from 'payload';

import { hasRole } from '@/access';
import { env } from '@/env';
import config from '@/payload.config';

export type ResetDemoResult =
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function resetDemo(): Promise<ResetDemoResult> {
  const payload = await getPayload({ config });

  // A server action is a public endpoint: the flag and the role are checked here, not only in the UI
  const { user } = await payload.auth({ headers: await headers() });
  if (
    !env.ALLOW_DEMO_RESET ||
    user?.collection !== 'users' ||
    !hasRole(user, 'admin')
  ) {
    return {
      status: 'error',
      message: 'Nincs jogosultsága a demóadatok visszaállításához.',
    };
  }

  try {
    // Lazy: the seed env (SEED_*) is only validated when a reset actually runs
    const { resetDemoData } = await import('@/seed/reset');
    await resetDemoData(payload);
    payload.logger.warn(`Demo data reset by ${user.email}`);
    return { status: 'success' };
  } catch (error) {
    payload.logger.error({ err: error }, 'Demo data reset failed');
    return {
      status: 'error',
      message: 'A visszaállítás nem sikerült, az adatok változatlanok.',
    };
  }
}
