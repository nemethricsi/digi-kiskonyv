// import { headers as getHeaders } from 'next/headers.js';

// import { getPayload } from 'payload';
// import { fileURLToPath } from 'url';

// import config from '@/payload.config';

export default async function HomePage() {
  // const headers = await getHeaders();
  // const payloadConfig = await config;
  // const payload = await getPayload({ config: payloadConfig });
  // const { user } = await payload.auth({ headers });

  // const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`;

  return (
    <>
      <dap-ds-official-website-banner></dap-ds-official-website-banner>
      <dap-ds-banner variant="warning">
        <strong>Fontos:</strong> Ez az oldal nem Magyarország hivatalos
        weboldala, csak egy demo.
      </dap-ds-banner>
      <div className="p-4">
        <dap-ds-stack>
          <h1 className="dds-heading dds-typography-h1">Digi Kiskönyv</h1>
          <dap-ds-input label="Név" placeholder="Gipsz Jakab"></dap-ds-input>
          <dap-ds-button className="w-full md:w-auto [&::part(base)]:w-full md:[&::part(base)]:w-auto">
            Belépés
          </dap-ds-button>
        </dap-ds-stack>
      </div>
    </>
  );
}
