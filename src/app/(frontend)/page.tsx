import { Hero } from '@/app/(frontend)/components/Hero';
import { LaunchSection } from '@/app/(frontend)/components/LaunchSection';
import { SiteFooter } from '@/app/(frontend)/components/SiteFooter';
import { SiteHeader } from '@/app/(frontend)/components/SiteHeader';

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <SiteHeader />
      <Hero />
      <LaunchSection />
      <SiteFooter />
    </div>
  );
}
