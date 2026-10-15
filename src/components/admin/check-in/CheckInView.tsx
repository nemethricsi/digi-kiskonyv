import { DefaultTemplate } from '@payloadcms/next/templates';
import { Gutter } from '@payloadcms/ui';

import { hasRole } from '@/access';
import { CheckInForm } from '@/components/admin/check-in/CheckInForm';

import type { AdminViewServerProps } from 'payload';

// /admin/check-in: the clerk redeems the citizen's code (QR scan or typed digits)
export function CheckInView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const {
    req: { user },
  } = initPageResult;
  const canRecord =
    user?.collection === 'users' && hasRole(user, 'admin', 'clerk');

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1>Megjelenés rögzítése</h1>
        {canRecord ? (
          <CheckInForm />
        ) : (
          <p>Ehhez a nézethez ügyintézői jogosultság kell.</p>
        )}
      </Gutter>
    </DefaultTemplate>
  );
}
