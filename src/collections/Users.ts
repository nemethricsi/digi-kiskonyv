import { isAdmin, isAdminFieldLevel } from '@/access/isAdmin';
import { isAdminOrSelf } from '@/access/isAdminOrSelf';
import { isLoggedIn } from '@/access/isLoggedIn';
import { Role, ROLE_LABELS, ROLES } from '@/lib/roles';

import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
    read: isLoggedIn,
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
        update: isAdminFieldLevel,
      },
    },
  ],
};
