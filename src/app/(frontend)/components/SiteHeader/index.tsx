import Image from 'next/image';
import Link from 'next/link';

import { AppLink } from '@/app/(frontend)/components/AppLink';
import { GithubIcon } from '@/app/(frontend)/components/GithubIcon';
import logo from '@/app/(frontend)/components/SiteHeader/logo-kek.svg';

export function SiteHeader() {
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
        <div className='flex items-center gap-3'>
          <AppLink
            as="button"
            variant="subtle"
            size="sm"
            className="button-with-icon"
            href="https://github.com/nemethricsi/digi-kiskonyv"
          >
            <GithubIcon className="size-(--dds-icon-small)" />
            GitHub
          </AppLink>
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
