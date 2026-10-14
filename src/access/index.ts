import { User } from '@/payload-types';

import type { Role } from '@/lib/roles';
import type { Access, PayloadRequest } from 'payload';

function hasRole(
  user: PayloadRequest['user'],
  ...roles: [Role, ...Role[]]
): boolean {
  if (user?.collection !== 'users') {
    return false;
  }
  return roles.includes(user.role);
}

export function hasAccess(...roles: [Role, ...Role[]]) {
  return ({ req: { user } }: { req: PayloadRequest }): boolean => {
    return hasRole(user, ...roles);
  };
}

export const isAdminOrSelf: Access<User> = ({ req: { user } }) => {
  if (user) {
    if (hasRole(user, 'admin')) {
      return true;
    }

    return {
      id: { equals: user.id },
    };
  }

  return false;
};
