import Image from 'next/image';

import illustration from '@/app/(frontend)/components/Hero/elvesztettem_a_munkam_allo_4_09ed058980.svg';
import { PrinterLineIcon } from '@/app/(frontend)/components/icons/PrinterLineIcon';

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

        {/* Decorative */}
        <Image
          src={illustration}
          alt=""
          className="mx-auto h-auto w-full max-w-xs md:max-w-md"
          priority
          unoptimized
        />
      </div>
    </section>
  );
}
