import Image from 'next/image';
import Link from 'next/link';

import logo from '@/app/(frontend)/components/SiteHeader/logo-feher.svg';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-(--dds-z-index-50) h-(--header-height) bg-(--dds-background-brand-base-inverted)">
      <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-4">
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
          variant="inverted"
          htmlType="button"
          aria-label="Keresés"
        ></dap-ds-icon-button>
      </div>
      <dap-ds-banner variant="warning">
        <strong>Fontos:</strong> Ez az oldal nem Magyarország hivatalos
        weboldala, csak egy demo.
      </dap-ds-banner>
    </header>
  );
}
