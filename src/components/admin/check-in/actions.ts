'use server';

import { headers } from 'next/headers';

import { getPayload, ValidationError } from 'payload';

import { hasRole } from '@/access';
import { CheckInCodeError, redeemCheckInCode } from '@/lib/check-in-code';
import config from '@/payload.config';

export type RedeemResult =
  | { status: 'success'; citizenName: string; appointmentTitle: string }
  | { status: 'error'; message: string };

export async function redeemCode(input: string): Promise<RedeemResult> {
  const payload = await getPayload({ config });

  // A server action is a public endpoint: check the admin session here, not only in the view
  const { user } = await payload.auth({ headers: await headers() });
  if (user?.collection !== 'users' || !hasRole(user, 'admin', 'clerk')) {
    return {
      status: 'error',
      message: 'Nincs jogosultsága megjelenést rögzíteni.',
    };
  }

  try {
    const attendance = await redeemCheckInCode(payload, { input, clerk: user });
    const { citizen, appointment } = attendance;
    return {
      status: 'success',
      citizenName: typeof citizen === 'object' && citizen ? citizen.name : '',
      appointmentTitle:
        typeof appointment === 'object' ? appointment.title : '',
    };
  } catch (error) {
    if (error instanceof CheckInCodeError) {
      return { status: 'error', message: error.message };
    }
    if (error instanceof ValidationError) {
      return {
        status: 'error',
        message: error.data.errors[0]?.message ?? error.message,
      };
    }
    payload.logger.error({ err: error }, 'Check-in code could not be redeemed');
    return {
      status: 'error',
      message: 'A rögzítés nem sikerült, próbálja újra.',
    };
  }
}
