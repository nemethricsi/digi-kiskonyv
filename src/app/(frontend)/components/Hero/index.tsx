import { getImageProps } from 'next/image';

import { AppLink } from '@/app/(frontend)/components/AppLink';
import { DemoWarning } from '@/app/(frontend)/components/DemoWarning';
import illustrationMobile from '@/app/(frontend)/components/Hero/elvesztettem_a_munkam_3_f4b789aaf2.svg';
import illustrationDesktop from '@/app/(frontend)/components/Hero/elvesztettem_a_munkam_allo_4_09ed058980.svg';
import { GithubIcon } from '@/app/(frontend)/components/icons/GithubIcon';
import { EXTERNAL_LINK_PROPS, GITHUB_URL } from '@/lib/constants';

/**
 * Art Direction as from Next.js docs
 * @see https://nextjs.org/docs/pages/api-reference/components/image#art-direction
 */
const common = {
  alt: '',
  unoptimized: true,
  loading: 'eager',
  fetchPriority: 'high',
} as const;
const { props: desktop } = getImageProps({
  ...common,
  src: illustrationDesktop,
});
const { props: mobile } = getImageProps({ ...common, src: illustrationMobile });

export function Hero() {
  return (
    <section className="relative bg-(--dds-background-brand-base-inverted) pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="mx-auto grid max-w-(--dds-containers-xlarge) items-center gap-10 px-4 md:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <DemoWarning />
          <div className="flex flex-wrap gap-3">
            <dap-ds-button
              variant="subtle-inverted"
              size="sm"
              htmlType="button"
              disabled
            >
              <dap-ds-stack direction="row">
                <span>Megosztás</span>
                <dap-ds-icon name="share-line" size="sm"></dap-ds-icon>
              </dap-ds-stack>
            </dap-ds-button>
            <dap-ds-button
              variant="subtle-inverted"
              size="sm"
              htmlType="button"
              href={GITHUB_URL}
              {...EXTERNAL_LINK_PROPS}
            >
              <dap-ds-stack direction="row">
                <span>GitHub</span>
                <GithubIcon className="size-(--dds-icon-small)" />
              </dap-ds-stack>
            </dap-ds-button>
          </div>

          <dap-ds-typography variant="h1" inverted>
            Elvesztettem a munkám
          </dap-ds-typography>
          <dap-ds-typography variant="body" size="lg" inverted>
            Álláskeresési járadék (munkanélküli segély) igénylése, támogatások
            munkakereséshez vagy karrierváltáshoz.
          </dap-ds-typography>

          <AppLink as="button" variant="subtle-inverted" href="/login">
            Álláskeresési járadék igénylése
          </AppLink>
        </div>

        {/* Decorative. md = 768px, the same breakpoint where the grid becomes two columns.
            The aspect ratio follows the selected image, so no layout shift when switching. */}
        <picture>
          <source media="(min-width: 768px)" srcSet={desktop.src} />
          <img
            {...mobile}
            alt=""
            className="mx-auto aspect-4502/1842 h-auto w-full md:aspect-square md:max-w-md"
          />
        </picture>
      </div>

      {/* Arch: a page-coloured half-ellipse over the bottom edge (same technique as the DÁP site) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[21px] rounded-t-[100%] bg-bg-base"
      />
    </section>
  );
}
