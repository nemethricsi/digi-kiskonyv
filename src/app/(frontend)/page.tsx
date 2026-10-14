// import { headers as getHeaders } from 'next/headers.js';

// import { getPayload } from 'payload';

import { Hero } from '@/app/(frontend)/components/Hero';
import { LaunchSection } from '@/app/(frontend)/components/LaunchSection';
import { SiteFooter } from '@/app/(frontend)/components/SiteFooter';
import { SiteHeader } from '@/app/(frontend)/components/SiteHeader';
// import config from '@/payload.config';

export default async function HomePage() {
  // const headers = await getHeaders();
  // const payloadConfig = await config;
  // const payload = await getPayload({ config: payloadConfig });
  // const { user } = await payload.auth({ headers });

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <dap-ds-official-website-banner></dap-ds-official-website-banner>
      <SiteHeader />
      <Hero />
      <LaunchSection />
      <SiteFooter />
      {/* <div className="mx-auto max-w-3xl p-4">
        <dap-ds-stack>
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
              Payload Admin
            </dap-ds-button>
          )}
        </dap-ds-stack>
      </div> */}
    </div>
  );
}
