import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPayload } from 'payload';

import { DemoWarning } from '@/app/(frontend)/components/DemoWarning';
import { SiteFooter } from '@/app/(frontend)/components/SiteFooter';
import { SiteHeader } from '@/app/(frontend)/components/SiteHeader';
import { CheckInCodeButton } from '@/app/(frontend)/dap/me/CheckInCodeButton';
import { getDemoCitizen } from '@/app/(frontend)/dap/me/demo-citizen';
import { RegistrationApplication } from '@/app/(frontend)/dap/me/RegistrationApplication';
import {
  APPOINTMENT_STATUS_BADGES,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_LIST_ITEMS,
} from '@/lib/appointment-status';
import {
  ACTIVE_REGISTRATION_STATUSES,
  REGISTRATION_STATUS_BADGES,
  REGISTRATION_STATUS_LABELS,
} from '@/lib/registration-status';
import { formatTaj } from '@/lib/taj';
import config from '@/payload.config';

import type { Appointment, Registration } from '@/payload-types';

export const metadata: Metadata = {
  title: 'Saját adataim (demó) • Digi Kiskönyv',
};

export const dynamic = 'force-dynamic';

const dateFormat = new Intl.DateTimeFormat('hu-HU', {
  dateStyle: 'long',
  timeZone: 'Europe/Budapest',
});

const dateTimeFormat = new Intl.DateTimeFormat('hu-HU', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Budapest',
});

type Detail = { label: string; value: string };

function DetailList({ details }: { details: Detail[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-[max-content_1fr]">
      {details.map(({ label, value }) => (
        <div key={label} className="contents">
          <dt className="text-text-subtle">{label}</dt>
          <dd className="font-semibold text-text-strong">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function AppointmentList({ appointments }: { appointments: Appointment[] }) {
  // The code is offered only for the next appointment (sorted by scheduledAt).
  // In production this would also check the date (e.g. only on the day itself).
  const nextScheduledId = appointments.find(
    ({ status }) => status === 'scheduled',
  )?.id;

  return (
    // Safari (VoiceOver) drops list semantics when list-style is none, so the role is not redundant
    // oxlint-disable-next-line jsx-a11y/no-redundant-roles
    <ul role="list" className="flex list-none flex-col gap-2">
      {appointments.map(({ id, title, scheduledAt, status }) => (
        <li key={id}>
          <dap-ds-list-item
            title={title}
            {...APPOINTMENT_STATUS_LIST_ITEMS[status]}
          >
            <time dateTime={scheduledAt}>
              {dateTimeFormat.format(new Date(scheduledAt))}
            </time>
            <dap-ds-badge
              slot="actions"
              type={APPOINTMENT_STATUS_BADGES[status]}
            >
              {APPOINTMENT_STATUS_LABELS[status]}
            </dap-ds-badge>
            {id === nextScheduledId && (
              <div slot="actions">
                <CheckInCodeButton appointmentId={id} />
              </div>
            )}
          </dap-ds-list-item>
        </li>
      ))}
    </ul>
  );
}

function RegistrationCard({
  registration,
  appointments,
}: {
  registration: Registration;
  appointments: Appointment[];
}) {
  const { status, requestedAt, startDate } = registration;

  const details: Detail[] = [
    {
      label: 'Kérelem ideje',
      value: dateTimeFormat.format(new Date(requestedAt)),
    },
  ];
  if (startDate) {
    details.push({
      label: 'Álláskeresés kezdete',
      value: dateFormat.format(new Date(startDate)),
    });
  }

  return (
    <dap-ds-card>
      <dap-ds-card-title>
        <span className="flex flex-wrap items-center gap-3">
          Álláskeresői nyilvántartásba vétel
          <dap-ds-badge type={REGISTRATION_STATUS_BADGES[status]}>
            {REGISTRATION_STATUS_LABELS[status]}
          </dap-ds-badge>
        </span>
      </dap-ds-card-title>
      <dap-ds-card-content>
        <div className="flex flex-col gap-6">
          <DetailList details={details} />
          {appointments.length > 0 && (
            <section className="flex flex-col gap-3">
              <dap-ds-typography variant="h3">
                Előírt jelentkezések
              </dap-ds-typography>
              <AppointmentList appointments={appointments} />
            </section>
          )}
        </div>
      </dap-ds-card-content>
    </dap-ds-card>
  );
}

export default async function CitizenPage() {
  const citizen = await getDemoCitizen();

  if (!citizen) {
    notFound();
  }

  const payload = await getPayload({ config });
  const {
    docs: [activeRegistration],
  } = await payload.find({
    collection: 'registrations',
    where: {
      citizen: { equals: citizen.id },
      status: { in: [...ACTIVE_REGISTRATION_STATUSES] },
    },
    sort: '-requestedAt',
    limit: 1,
    depth: 0,
  });

  const { docs: appointments } = activeRegistration
    ? await payload.find({
        collection: 'appointments',
        where: { registration: { equals: activeRegistration.id } },
        sort: 'scheduledAt',
        pagination: false,
        depth: 0,
      })
    : { docs: [] };

  const personalDetails: Detail[] = [
    { label: 'Születési hely', value: citizen.placeOfBirth },
    {
      label: 'Születési idő',
      value: dateFormat.format(new Date(citizen.dateOfBirth)),
    },
    { label: 'Anyja neve', value: citizen.nameOfMother },
    { label: 'TAJ szám', value: formatTaj(citizen.taj) },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-(--dds-containers-large) flex-1 flex-col gap-6 px-4 py-8 md:py-12 [&_dap-ds-card]:[--dds-card-background:var(--dds-background-neutral-subtle)]">
        <div className="flex flex-col items-start gap-2">
          <dap-ds-badge type="warning">DEMO</dap-ds-badge>
          <dap-ds-typography variant="h1">{citizen.name}</dap-ds-typography>
          <dap-ds-typography variant="description">
            A DÁP-azonosításból átvett személyes adatok
          </dap-ds-typography>
        </div>
        <DemoWarning />

        <dap-ds-card>
          <dap-ds-card-title>Személyes adatok</dap-ds-card-title>
          <dap-ds-card-content>
            <DetailList details={personalDetails} />
          </dap-ds-card-content>
        </dap-ds-card>

        {activeRegistration ? (
          <RegistrationCard
            registration={activeRegistration}
            appointments={appointments}
          />
        ) : (
          <dap-ds-callout
            variant="info"
            title="Jelenleg nem regisztrált álláskereső"
          >
            Nincs aktív álláskeresői nyilvántartásba vétele.
            <div slot="actions">
              <RegistrationApplication />
            </div>
          </dap-ds-callout>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
