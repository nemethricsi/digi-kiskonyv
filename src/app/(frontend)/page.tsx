// import { headers as getHeaders } from 'next/headers.js';

// import { getPayload } from 'payload';

import SiteHeader from '@/app/(frontend)/components/SiteHeader';
// import config from '@/payload.config';

export default async function HomePage() {
  // const headers = await getHeaders();
  // const payloadConfig = await config;
  // const payload = await getPayload({ config: payloadConfig });
  // const { user } = await payload.auth({ headers });

  return (
    <>
      <dap-ds-official-website-banner></dap-ds-official-website-banner>
      <SiteHeader />
      <div className="mx-auto max-w-3xl p-4">
        {/* <dap-ds-stack>
          <h1 className="dds-heading dds-typography-h1">Digi Kiskönyv</h1>
          <dap-ds-input label="Név" placeholder="Gipsz Jakab"></dap-ds-input>
          <dap-ds-button className="w-full md:w-auto [&::part(base)]:w-full md:[&::part(base)]:w-auto">
            Belépés
          </dap-ds-button>
          {user != null && (
            <dap-ds-button
              variant="subtle"
              href="/admin"
              className="w-full md:w-auto [&::part(base)]:w-full md:[&::part(base)]:w-auto"
            >
              Admin
            </dap-ds-button>
          )}
        </dap-ds-stack> */}
      </div>
    </>
  );
}
