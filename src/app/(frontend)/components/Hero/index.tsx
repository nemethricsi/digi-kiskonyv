import { getImageProps } from 'next/image';

import illustrationMobile from '@/app/(frontend)/components/Hero/elvesztettem_a_munkam_3_f4b789aaf2.svg';
import illustrationDesktop from '@/app/(frontend)/components/Hero/elvesztettem_a_munkam_allo_4_09ed058980.svg';
import { PrinterLineIcon } from '@/app/(frontend)/components/icons/PrinterLineIcon';

/**
 * Art Direction
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
    <section className="bg-(--dds-background-brand-base-inverted) pt-12 pb-20 [clip-path:ellipse(120%_100%_at_50%_0%)] md:pt-20 md:pb-28">
      <div className="mx-auto grid max-w-(--dds-containers-xlarge) items-center gap-10 px-4 md:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-wrap gap-3">
            <dap-ds-button
              variant="subtle-inverted"
              size="sm"
              htmlType="button"
              className="button-with-icon"
            >
              Megosztás
              <dap-ds-icon name="share-line" size="sm"></dap-ds-icon>
            </dap-ds-button>
            <dap-ds-button
              variant="subtle-inverted"
              size="sm"
              htmlType="button"
              className="button-with-icon"
            >
              Nyomtatás
              <PrinterLineIcon className="size-(--dds-icon-small)" />
            </dap-ds-button>
          </div>

          <dap-ds-typography variant="h1" inverted>
            Elvesztettem a munkám
          </dap-ds-typography>
          <dap-ds-typography variant="body" size="lg" inverted>
            Álláskeresési járadék (munkanélküli segély) igénylése, támogatások
            munkakereséshez vagy karrierváltáshoz.
          </dap-ds-typography>

          <dap-ds-button variant="subtle-inverted" htmlType="button">
            Álláskeresési járadék igénylése
          </dap-ds-button>
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
    </section>
  );
}
