import { ValidationError } from 'payload';

import { hasAccess } from '@/access';
import { FROM_ATTENDANCE } from '@/collections/Appointments';
import {
  ATTENDANCE_METHOD_LABELS,
  ATTENDANCE_METHODS,
  FROM_CHECK_IN_CODE,
} from '@/lib/attendance-method';
import { relationId } from '@/lib/relation-id';

import type { AppointmentStatus } from '@/lib/appointment-status';
import type { AttendanceMethod } from '@/lib/attendance-method';
import type { Attendance } from '@/payload-types';
import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
} from 'payload';

// Only for a scheduled appointment. Who, when and for whom is always set on the server.
const validateAndFill: CollectionBeforeChangeHook = async ({
  context,
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') {
    return data;
  }

  const appointmentId = relationId(data.appointment);
  const appointment = appointmentId
    ? await req.payload.findByID({
        collection: 'appointments',
        id: appointmentId,
        depth: 0,
        req, // same transaction
      })
    : undefined;

  if (appointment?.status !== ('scheduled' satisfies AppointmentStatus)) {
    throw new ValidationError({
      collection: 'attendances',
      errors: [
        {
          path: 'appointment',
          message: 'Megjelenés csak ütemezett időponthoz rögzíthető.',
        },
      ],
    });
  }

  data.citizen = relationId(appointment.citizen);
  data.recordedAt = new Date().toISOString();
  data.recordedBy = req.user?.collection === 'users' ? req.user.id : null;
  // Never from the request body: only the code redemption on the server sets the context
  data.method = (
    context[FROM_CHECK_IN_CODE] ? 'code' : 'manual'
  ) satisfies AttendanceMethod;
  return data;
};

const markAppointmentAttended: CollectionAfterChangeHook<Attendance> = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') {
    return doc;
  }

  await req.payload.update({
    collection: 'appointments',
    id: relationId(doc.appointment)!,
    data: { status: 'attended' },
    context: { [FROM_ATTENDANCE]: true },
    req, // same transaction: no stamp without the status, and vice versa
  });

  return doc;
};

// The "stamp": create only, nobody can change or delete it
export const Attendances: CollectionConfig = {
  slug: 'attendances',
  labels: {
    plural: 'Megjelenések',
    singular: 'Megjelenés',
  },
  admin: {
    defaultColumns: [
      'recordedAt',
      'citizen',
      'appointment',
      'method',
      'recordedBy',
    ],
  },
  access: {
    create: hasAccess('admin', 'clerk'),
    read: hasAccess('admin', 'clerk'),
    update: () => false,
    delete: () => false,
  },
  hooks: {
    beforeChange: [validateAndFill],
    afterChange: [markAppointmentAttended],
  },
  fields: [
    {
      name: 'appointment',
      label: 'Előírt jelentkezés',
      type: 'relationship',
      relationTo: 'appointments',
      required: true,
      unique: true, // at most one stamp per appointment
      filterOptions: {
        status: { equals: 'scheduled' satisfies AppointmentStatus },
      },
    },
    {
      name: 'citizen',
      label: 'Állampolgár',
      type: 'relationship',
      relationTo: 'citizens',
      index: true,
      admin: {
        readOnly: true,
        description: 'Az időpontból töltődik ki.',
      },
    },
    {
      name: 'recordedAt',
      label: 'Rögzítés ideje',
      type: 'date',
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'recordedBy',
      label: 'Rögzítette',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'method',
      label: 'Rögzítés módja',
      type: 'select',
      options: ATTENDANCE_METHODS.map((method) => ({
        value: method,
        label: ATTENDANCE_METHOD_LABELS[method],
      })),
      required: true,
      defaultValue: 'manual' satisfies AttendanceMethod,
      admin: {
        readOnly: true,
      },
    },
  ],
};
