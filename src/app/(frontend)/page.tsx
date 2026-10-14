import { headers as getHeaders } from 'next/headers.js';
import Image from 'next/image';
import React from 'react';

import { getPayload } from 'payload';
import { fileURLToPath } from 'url';

import config from '@/payload.config';

export default async function HomePage() {
  const headers = await getHeaders();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers });

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`;

  return (
    <>
      <dap-ds-official-website-banner>
        <span slot="heading">NEM Magyarország hivatalos weboldala</span>
        Fejlesztői bemutató a DÁP Design System használatáról. Minden adat
        kitalált.
      </dap-ds-official-website-banner>
      <div className="home">
        <div className="content">
          <h1>Árvíztűrő tükörfúrógép</h1>
          <p>őű ŐŰ áéíóöúü</p>

          <dap-ds-button variant="primary">Tovább</dap-ds-button>
          <dap-ds-button variant="outline" href="/admin">
            Admin felület
          </dap-ds-button>
          {!user && <h1>Welcome to your new project.</h1>}
          {user && <h1>Welcome back, {user.email}</h1>}
          <div className="links">
            <a
              className="admin"
              href={payloadConfig.routes.admin}
              rel="noopener noreferrer"
              target="_blank"
            >
              Go to admin panel
            </a>
            <a
              className="docs"
              href="https://payloadcms.com/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              Documentation
            </a>
          </div>
        </div>
        <div className="footer">
          <p>Update this page by editing</p>
          <a className="codeLink" href={fileURL}>
            <code>app/(frontend)/page.tsx</code>
          </a>
        </div>
      </div>
    </>
  );
}
