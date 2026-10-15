import { hasRole } from '@/access';
import { ResetDemoButton } from '@/components/admin/reset-demo/ResetDemoButton';
import { env } from '@/env';

import type { ServerProps } from 'payload';

// Dashboard panel (beforeDashboard). Hiding it is only UX: the action checks the same rules.
export function ResetDemo({ user }: ServerProps) {
  if (!env.ALLOW_DEMO_RESET || !hasRole(user ?? null, 'admin')) {
    return null;
  }

  return (
    <section style={{ marginBottom: 'var(--base)' }}>
      <h2>Adatbázis visszaállítása</h2>
      <p>
        Minden adat törlődik, majd a kezdő demóadatok (admin, ügyintéző, demó
        állampolgár) újra létrejönnek. Utána újra be kell jelentkezni.
      </p>
      <ResetDemoButton />
    </section>
  );
}
