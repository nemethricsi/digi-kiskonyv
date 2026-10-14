import Image from 'next/image';
import Link from 'next/link';

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
        <dap-ds-icon-button
          icon="search-line"
          variant="brand"
          htmlType="button"
          aria-label="Keresés"
        ></dap-ds-icon-button>
      </div>
      <dap-ds-banner variant="negative">
        <strong>Fontos:</strong> Ez nem Magyarország hivatalos weboldala, csak
        egy demo.
      </dap-ds-banner>
    </header>
  );
}
