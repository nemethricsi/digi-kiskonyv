import type { Metadata } from 'next';
import Image from 'next/image';

import { AppLink } from '@/app/(frontend)/components/AppLink';
import { DemoWarning } from '@/app/(frontend)/components/DemoWarning';
import { SiteFooter } from '@/app/(frontend)/components/SiteFooter';
import appStoreBadge from '@/app/(frontend)/login/app-store.svg';
import illustration from '@/app/(frontend)/login/hand-2.svg';
import playStoreBadge from '@/app/(frontend)/login/play-store.svg';

export const metadata: Metadata = {
  title: 'Bejelentkezés (demó) • Digi Kiskönyv',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg md:bg-bg-base">
      <main className="flex flex-1 items-start justify-center md:p-10">
        <div className="grid w-full max-w-(--dds-containers-large) gap-8 bg-bg p-6 md:grid-cols-2 md:gap-6 md:rounded-(--dds-radius-base) md:p-5">
          <section className="flex flex-col gap-6 md:p-12">
            <AppLink href="/" variant="neutral" bold noUnderline>
              <dap-ds-icon name="arrow-left-line" size="sm"></dap-ds-icon>
              Vissza a kezdőlapra
            </AppLink>

            <div className="flex flex-col items-start gap-2">
              <dap-ds-badge type="warning">DEMO</dap-ds-badge>
              <dap-ds-typography variant="h1">Bejelentkezés</dap-ds-typography>
              <dap-ds-typography variant="body">
                Szimulált azonosítás: valódi DÁP-belépés nem történik, a gomb
                egy kitalált demó-állampolgárt léptet be.
              </dap-ds-typography>
            </div>
            <AppLink
              as="button"
              variant="primary"
              href="/dap/me"
              className="[&::part(base)]:w-full"
              size="lg"
            >
              DÁP mobilalkalmazás
            </AppLink>
            <DemoWarning />
          </section>

          <aside className="flex flex-col gap-4 overflow-hidden rounded-(--dds-radius-large) bg-(--dds-background-brand-base-inverted) p-6 md:p-12">
            <dap-ds-typography variant="h3" inverted>
              Hogyan működne élesben?
            </dap-ds-typography>
            <dap-ds-typography variant="body" inverted>
              Valódi szolgáltatásban itt a Digitális Állampolgárság azonosítása
              futna, és az ügyfél a DÁP mobilalkalmazással azonosítaná magát.
              Ebben a demóban ez a lépés le van egyszerűsítve.
            </dap-ds-typography>

            <div className="grid grid-cols-2 gap-4 md:flex">
              <Image
                src={appStoreBadge}
                alt="Letölthető az App Store-ból"
                className="h-auto w-full md:h-10 md:w-auto"
                loading="eager"
              />
              <Image
                src={playStoreBadge}
                alt="Szerezd meg: Google Play"
                className="h-auto w-full md:h-10 md:w-auto"
                loading="eager"
              />
            </div>

            <Image
              src={illustration}
              alt=""
              className="mt-auto -mb-6 h-auto w-full md:-mb-12"
              loading="eager"
            />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
