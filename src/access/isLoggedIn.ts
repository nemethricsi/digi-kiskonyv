import type { User } from '@/payload-types';
import type { Access } from 'payload';

export const isLoggedIn: Access<User> = ({ req: { user } }) => {
  return Boolean(user);
};
