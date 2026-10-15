import { hasAccess } from '@/access';
import { isValidTaj, normalizeTaj } from '@/lib/taj';

import type { CollectionConfig } from 'payload';

export const Citizen: CollectionConfig = {
  slug: 'citizens',
  labels: {
    plural: 'Állampolgárok',
    singular: 'Állampolgár',
  },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: hasAccess('admin', 'clerk'),
    create: hasAccess('admin'),
    update: hasAccess('admin'),
    delete: hasAccess('admin'),
  },
  fields: [
    {
      name: 'name',
      label: 'Név',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'placeOfBirth',
      label: 'Születési helye',
      type: 'text',
      required: true,
    },
    {
      name: 'dateOfBirth',
      label: 'Születési ideje',
      type: 'date',
      admin: {
        date: {
          displayFormat: 'yyyy-MM-dd',
          pickerAppearance: 'dayOnly',
        },
      },
      required: true,
    },
    {
      name: 'nameOfMother',
      label: 'Anyja neve',
      type: 'text',
      required: true,
    },
    {
      // Text, not number: a TAJ can start with 0
      name: 'taj',
      label: 'TAJ szám',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: '9 számjegy',
        components: {
          Field: '/components/admin/TajField#TajField',
        },
      },
      hooks: {
        beforeValidate: [
          ({ value }) =>
            typeof value === 'string' ? normalizeTaj(value) : value,
        ],
      },
      validate: (value: string | null | undefined) => {
        if (!value) {
          return 'A TAJ szám megadása kötelező.';
        }
        return isValidTaj(value) || 'Érvénytelen TAJ szám.';
      },
    },
    {
      name: 'registrations',
      label: 'Nyilvántartásba vételek',
      type: 'join',
      collection: 'registrations',
      on: 'citizen',
      defaultSort: '-requestedAt',
      admin: {
        defaultColumns: ['requestedAt', 'status', 'startDate', 'endDate'],
        allowCreate: false,
      },
    },
  ],
};
