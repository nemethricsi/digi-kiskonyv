import type { CollectionConfig } from 'payload';

const ROLES = ['admin', 'clerk', 'editor'] as const;
type Role = (typeof ROLES)[number];

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  clerk: 'Ügyintéző',
  editor: 'Szerkesztő',
};

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      options: ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
      defaultValue: 'clerk' satisfies Role,
      required: true,
      saveToJWT: true,
    },
  ],
};
