'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

export default function ClientApplication({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    import('dap-design-system').catch((error: unknown) => {
      console.error('Failed to register DÁP components', error);
    });
  }, []);

  return children;
}
