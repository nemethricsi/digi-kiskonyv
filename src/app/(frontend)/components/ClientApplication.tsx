'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

export default function ClientApplication({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    // Keep in sync with src/types/dap-ds.d.ts: every element typed there is registered here
    Promise.all([
      import('dap-design-system/components/button'),
      import('dap-design-system/components/official-website-banner'),
    ]).catch((error: unknown) => {
      console.error('Failed to register DÁP components', error);
    });
  }, []);

  return children;
}
