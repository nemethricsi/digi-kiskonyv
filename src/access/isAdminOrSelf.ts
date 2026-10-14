import type { User } from '@/payload-types';
import type { Access } from 'payload';

export const isAdminOrSelf: Access<User> = ({ req: { user } }) => {
  if (user) {
    if (user.role === 'admin') {
      return true;
    }

    return {
      id: { equals: user.id },
    };
  }

  return false;
};
