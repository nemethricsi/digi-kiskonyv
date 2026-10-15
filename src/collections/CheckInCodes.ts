import type { CollectionConfig } from 'payload';

// Short-lived, single-use codes the citizen shows at the office (QR + digits).
// Closed on every API: only server code reaches it through the Local API, so a clerk cannot
// read a code in the admin and record an attendance without the citizen being there.
export const CheckInCodes: CollectionConfig = {
  slug: 'check-in-codes',
  labels: {
    plural: 'Megjelenési kódok',
    singular: 'Megjelenési kód',
  },
  admin: {
    hidden: true,
  },
  access: {
    read: () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'appointment',
      type: 'relationship',
      relationTo: 'appointments',
      required: true,
      index: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      index: true,
    },
  ],
};
