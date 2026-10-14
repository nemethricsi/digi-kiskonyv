import type { User } from '@/payload-types';
import type { Access, FieldAccess } from 'payload';

export const isAdmin: Access<User> = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin');
};

export const isAdminFieldLevel: FieldAccess<{ id: string }, User> = ({
  req: { user },
}) => {
  return Boolean(user?.role === 'admin');
};
