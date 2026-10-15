import { headers as getHeaders } from 'next/headers.js';
import Image from 'next/image';
import Link from 'next/link';

import { getPayload } from 'payload';

import { GithubIcon } from '@/app/(frontend)/components/GithubIcon';
import logo from '@/app/(frontend)/components/SiteHeader/logo-kek.svg';
import config from '@/payload.config';

export async function SiteHeader() {
  const headers = await getHeaders();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers });
  return (
    <header className="sticky top-0 z-(--dds-z-index-50) border-b border-border-divider bg-bg">
      <div className="mx-auto flex h-(--header-height) max-w-(--dds-containers-xlarge) items-center justify-between px-4">
        <Link href="/">
          <Image
            src={logo}
            alt="Digitális Állampolgárság Program – kezdőlap"
            className="h-10 w-auto"
            priority
            unoptimized
          />
        </Link>
        <div className="flex items-center gap-3">
          <dap-ds-command>
            <dap-ds-button
              slot="trigger"
              size="sm"
              variant="subtle"
              className="button-with-icon"
            >
              Menü
              <dap-ds-icon name="menu-line-s"></dap-ds-icon>
            </dap-ds-button>
            <dap-ds-command-item href="/admin">
              <dap-ds-stack direction="row">
                <dap-ds-icon name="arrow-right-line" size="xs"></dap-ds-icon>
                <span>{user ? `${user.role} Payload` : 'Payload'}</span>
              </dap-ds-stack>
            </dap-ds-command-item>
            <dap-ds-command-item
              href="https://github.com/nemethricsi/digi-kiskonyv"
              target="_blank"
              rel="noopener noreferrer"
            >
              <dap-ds-stack direction="row">
                <GithubIcon className="size-(--dds-icon-small)" />
                <span>GitHub</span>
                <dap-ds-icon name="external-link-line" size="sm"></dap-ds-icon>
              </dap-ds-stack>
            </dap-ds-command-item>
          </dap-ds-command>
          <dap-ds-icon-button
            icon="search-line"
            variant="brand"
            htmlType="button"
            aria-label="Keresés"
          ></dap-ds-icon-button>
        </div>
      </div>
    </header>
  );
}
