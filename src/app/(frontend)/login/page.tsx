import type { Metadata } from 'next';
import Image from 'next/image';

import { SiteFooter } from '@/app/(frontend)/components/SiteFooter';
import appStoreBadge from '@/app/(frontend)/login/app-store.svg';
import illustration from '@/app/(frontend)/login/hand-2.svg';
import playStoreBadge from '@/app/(frontend)/login/play-store.svg';

export const metadata: Metadata = {
  title: 'Bejelentkezés (demó) • Digi Kiskönyv',
};

// Mock of a DÁP-style sign-in screen. Layout follows the real one, but every text says it is a demo:
// no DÁP/iD logo, no "Ügyfélkapu+" option, no credential fields.
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <main className="flex flex-1 items-start justify-center p-4 md:p-10">
        <div className="grid w-full max-w-(--dds-containers-large) gap-6 rounded-(--dds-radius-base) bg-bg p-4 md:grid-cols-2 md:p-5">
          <section className="flex flex-col gap-6 p-4 md:p-12">
            <dap-ds-link href="/" variant="neutral" bold noUnderline>
              <dap-ds-icon name="arrow-left-line" size="sm"></dap-ds-icon>
              Vissza a kezdőlapra
            </dap-ds-link>

            <div className="flex flex-col items-start gap-2">
              <dap-ds-badge type="warning">DEMÓ</dap-ds-badge>
              <dap-ds-typography variant="h1">Bejelentkezés</dap-ds-typography>
              <dap-ds-typography variant="body">
                Szimulált azonosítás: valódi DÁP-belépés nem történik, a gomb
                egy kitalált demó-állampolgárt léptet be.
              </dap-ds-typography>
            </div>

            {/* Wired to the mock sign-in server action in the next step */}
            <dap-ds-button className="[&::part(base)]:w-full" size="lg">
              DÁP mobilalkalmazás
            </dap-ds-button>
          </section>

          <aside className="flex flex-col gap-4 overflow-hidden rounded-(--dds-radius-large) bg-(--dds-background-brand-base-inverted) p-8 md:p-12">
            <dap-ds-typography variant="h3" inverted>
              Hogyan működne élesben?
            </dap-ds-typography>
            <dap-ds-typography variant="body" inverted>
              Valódi szolgáltatásban itt a Digitális Állampolgárság azonosítása
              futna, és az ügyfél a DÁP mobilalkalmazással azonosítaná magát.
              Ebben a demóban ez a lépés le van egyszerűsítve.
            </dap-ds-typography>

            {/* Not links: no real store URL in a demo */}
            <div className="flex flex-wrap gap-4">
              <Image
                src={appStoreBadge}
                alt="Letölthető az App Store-ból"
                className="h-10 w-auto"
                unoptimized
              />
              <Image
                src={playStoreBadge}
                alt="Szerezd meg: Google Play"
                className="h-10 w-auto"
                unoptimized
              />
            </div>

            {/* Decorative, bleeds to the panel's bottom edge */}
            <Image
              src={illustration}
              alt=""
              className="mt-auto -mb-8 h-auto w-full md:-mb-12"
              unoptimized
            />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
