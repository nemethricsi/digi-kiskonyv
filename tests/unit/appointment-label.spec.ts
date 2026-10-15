import { describe, expect, it } from 'vitest';

import { appointmentLabel } from '@/lib/appointment-label';

describe('appointmentLabel', () => {
  it('joins name, Budapest time and title', () => {
    expect(
      appointmentLabel({
        citizenName: 'Gipsz Jakab',
        scheduledAt: '2026-10-22T08:00:00.000Z',
        title: 'Munkaügyi tájékoztató',
      }),
    ).toBe('Gipsz Jakab · 2026. 10. 22. 10:00 · Munkaügyi tájékoztató');
  });

  it('follows daylight saving time', () => {
    expect(
      appointmentLabel({
        citizenName: 'Gipsz Jakab',
        scheduledAt: '2026-11-22T08:00:00.000Z',
        title: 'Munkaügyi tájékoztató',
      }),
    ).toBe('Gipsz Jakab · 2026. 11. 22. 9:00 · Munkaügyi tájékoztató');
  });
});
