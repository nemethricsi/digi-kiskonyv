import { hasAccess, isAdminOrSelf } from '@/access';
import { ROLE_LABELS, ROLES } from '@/lib/roles';

import type { Role } from '@/lib/roles';
import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: hasAccess('admin'),
    update: isAdminOrSelf,
    delete: hasAccess('admin'),
    read: hasAccess(...ROLES),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
      defaultValue: 'clerk' satisfies Role,
      required: true,
      saveToJWT: true,
      access: {
        update: hasAccess('admin'),
      },
    },
  ],
};
