import { AppLink } from '@/app/(frontend)/components/AppLink';

export function LaunchSection() {
  return (
    <section id="adk" className="flex-1 bg-bg-base py-12 md:py-16">
      <div className="mx-auto flex max-w-(--dds-containers-xlarge) flex-col items-start gap-4 px-4">
        <dap-ds-typography variant="h2">
          Álláskeresők Digitális Kiskönyve
        </dap-ds-typography>
        <dap-ds-typography variant="body" className="max-w-2xl">
          A papír alapú kiskönyv helyett mostantól online is láthatja az előírt
          megjelenéseit, és a megjelenések igazolása mindig Önnél marad.
        </dap-ds-typography>
        <AppLink
          as="button"
          href="/login"
          variant="primary"
          className="mt-2 w-full md:w-auto [&::part(base)]:w-full md:[&::part(base)]:w-auto"
        >
          Nyilvántartásba vétel
        </AppLink>
      </div>
    </section>
  );
}
