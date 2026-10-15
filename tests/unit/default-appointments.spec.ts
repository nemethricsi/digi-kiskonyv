import { describe, expect, it } from 'vitest';

import {
  DEFAULT_APPOINTMENT_COUNT,
  defaultAppointmentDates,
} from '@/lib/default-appointments';

describe('defaultAppointmentDates', () => {
  it('schedules the first a week after the start, then monthly', () => {
    const dates = defaultAppointmentDates(new Date('2026-10-01T00:00:00Z'));

    expect(dates).toHaveLength(DEFAULT_APPOINTMENT_COUNT);
    expect(dates.map((date) => date.toISOString())).toEqual([
      '2026-10-08T08:00:00.000Z',
      '2026-11-08T08:00:00.000Z',
      '2026-12-08T08:00:00.000Z',
    ]);
  });

  it('does not mutate the start date', () => {
    const startDate = new Date('2026-10-01T00:00:00Z');
    defaultAppointmentDates(startDate);

    expect(startDate.toISOString()).toBe('2026-10-01T00:00:00.000Z');
  });
});
