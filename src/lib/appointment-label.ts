// "2026. 10. 22. 10:00". The migration backfill builds the same string in SQL
// (to_char(... AT TIME ZONE 'Europe/Budapest', 'YYYY. MM. DD. FMHH24:MI'): FM because the hour is
// not zero-padded here, "9:00"), keep them in sync.
const dateTimeFormat = new Intl.DateTimeFormat('hu-HU', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Europe/Budapest',
});

/** Admin title of an appointment: who, when, what. Searchable by name in relationship pickers. */
export function appointmentLabel({
  citizenName,
  scheduledAt,
  title,
}: {
  citizenName: string;
  scheduledAt: string;
  title: string;
}): string {
  return [
    citizenName,
    dateTimeFormat.format(new Date(scheduledAt)),
    title,
  ].join(' · ');
}
