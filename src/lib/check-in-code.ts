import { randomInt } from 'node:crypto';

import { FROM_CHECK_IN_CODE } from '@/lib/attendance-method';
import { relationId } from '@/lib/relation-id';

import type { AppointmentStatus } from '@/lib/appointment-status';
import type { Attendance, User } from '@/payload-types';
import type { Payload } from 'payload';

export const CHECK_IN_CODE_LENGTH = 6;
export const CHECK_IN_CODE_TTL_SECONDS = 60;
const MAX_ATTEMPTS = 5;

/** Digits only: typeable, and what a keyboard-wedge barcode scanner types into the input */
export function generateCheckInCode(): string {
  return randomInt(0, 10 ** CHECK_IN_CODE_LENGTH)
    .toString()
    .padStart(CHECK_IN_CODE_LENGTH, '0');
}

/** Scanners and people add spaces or line breaks: keep the digits only */
export function normalizeCheckInCode(input: string): string {
  return input.replace(/\D/g, '');
}

export class CheckInCodeError extends Error {}

/**
 * A new code for the citizen's own scheduled appointment. Earlier codes of the appointment
 * stop working, so only the code on the screen right now is valid.
 */
export async function issueCheckInCode(
  payload: Payload,
  { appointmentId, citizenId }: { appointmentId: string; citizenId: string },
): Promise<{ code: string; expiresAt: string }> {
  const appointment = await payload
    .findByID({ collection: 'appointments', id: appointmentId, depth: 0 })
    .catch(() => undefined);

  if (
    !appointment ||
    relationId(appointment.citizen) !== citizenId ||
    appointment.status !== ('scheduled' satisfies AppointmentStatus)
  ) {
    throw new CheckInCodeError('Ehhez az időponthoz nem kérhető kód.');
  }

  await payload.delete({
    collection: 'check-in-codes',
    where: {
      or: [
        { appointment: { equals: appointmentId } },
        { expiresAt: { less_than: new Date().toISOString() } }, // housekeeping
      ],
    },
  });

  const expiresAt = new Date(
    Date.now() + CHECK_IN_CODE_TTL_SECONDS * 1000,
  ).toISOString();

  // The unique index decides on a collision; with few live codes a retry is enough
  for (let attempt = 1; ; attempt++) {
    const code = generateCheckInCode();
    try {
      await payload.create({
        collection: 'check-in-codes',
        data: { appointment: appointmentId, code, expiresAt },
      });
      return { code, expiresAt };
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS) {
        throw error;
      }
    }
  }
}

/**
 * Records the attendance for a valid code, on behalf of the clerk (their access applies).
 * The code is deleted first: if two scans race, only one delete returns it.
 */
export async function redeemCheckInCode(
  payload: Payload,
  { input, clerk }: { input: string; clerk: User },
): Promise<Attendance> {
  const { docs } = await payload.delete({
    collection: 'check-in-codes',
    where: {
      code: { equals: normalizeCheckInCode(input) },
      expiresAt: { greater_than: new Date().toISOString() },
    },
    depth: 0,
  });

  const appointmentId = relationId(docs[0]?.appointment);
  if (!appointmentId) {
    throw new CheckInCodeError('Érvénytelen vagy lejárt kód.');
  }

  return payload.create({
    collection: 'attendances',
    // method is required by the type; the hook sets it from the context anyway
    data: { appointment: appointmentId, method: 'code' },
    user: clerk,
    overrideAccess: false,
    depth: 1, // citizen and appointment populated for the confirmation message
    context: { [FROM_CHECK_IN_CODE]: true },
  });
}
