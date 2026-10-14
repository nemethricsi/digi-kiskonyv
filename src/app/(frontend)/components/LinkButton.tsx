'use client';

import { useRouter } from 'next/navigation';

import type { ButtonVariant } from 'dap-design-system';

interface LinkButtonProps {
  label: string;
  href: string;
  variant: ButtonVariant | undefined;
  className?: string;
}

export function LinkButton({
  label,
  href,
  variant,
  className,
}: LinkButtonProps) {
  const router = useRouter();
  function handleClick() {
    router.push(href);
  }
  return (
    <dap-ds-button
      variant={variant}
      onClick={handleClick}
      className={className}
    >
      {label}
    </dap-ds-button>
  );
}
