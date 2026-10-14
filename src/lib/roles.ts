export const ROLES = ['admin', 'clerk', 'editor'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  clerk: 'Ügyintéző',
  editor: 'Szerkesztő',
};
