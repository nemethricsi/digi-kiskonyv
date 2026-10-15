'use server';

import { revalidatePath } from 'next/cache';

import { getPayload } from 'payload';
import QRCode from 'qrcode';

import { getDemoCitizen } from '@/app/(frontend)/dap/me/demo-citizen';
import {
  CHECK_IN_CODE_TTL_SECONDS,
  CheckInCodeError,
  issueCheckInCode,
} from '@/lib/check-in-code';
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

export type RequestCheckInCodeResult =
  | {
      status: 'success';
      code: string;
      /** SVG data URI for an <img> */
      qrImageSrc: string;
      /** Relative, so a wrong clock on the phone does not break the countdown */
      expiresInSeconds: number;
      ttlSeconds: number;
    }
  | { status: 'error'; message: string };

export async function requestCheckInCode(
  appointmentId: string,
): Promise<RequestCheckInCodeResult> {
  const citizen = await getDemoCitizen();
  if (!citizen) {
    return { status: 'error', message: 'Nincs bejelentkezett állampolgár.' };
  }

  const payload = await getPayload({ config });

  try {
    // issueCheckInCode checks that the appointment belongs to this citizen
    const { code, expiresAt } = await issueCheckInCode(payload, {
      appointmentId,
      citizenId: citizen.id,
    });
    // Rendered on the server: the QR library stays out of the client bundle
    const qrSvg = await QRCode.toString(code, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'M',
    });
    return {
      status: 'success',
      code,
      qrImageSrc: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg)}`,
      expiresInSeconds: Math.floor((Date.parse(expiresAt) - Date.now()) / 1000),
      ttlSeconds: CHECK_IN_CODE_TTL_SECONDS,
    };
  } catch (error) {
    if (error instanceof CheckInCodeError) {
      return { status: 'error', message: error.message };
    }
    payload.logger.error({ err: error }, 'Check-in code could not be issued');
    return {
      status: 'error',
      message: 'A kód most nem kérhető, próbálja újra.',
    };
  }
}
