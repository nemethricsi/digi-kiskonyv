'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';

import type {
  ButtonSize,
  ButtonVariant,
  LinkSize,
  LinkVariant,
} from 'dap-design-system';

type CommonProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

type ButtonLookProps = CommonProps & {
  as: 'button';
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type LinkLookProps = CommonProps & {
  as?: 'link';
  variant?: LinkVariant;
  size?: LinkSize;
  bold?: boolean;
  noUnderline?: boolean;
};

export type AppLinkProps = ButtonLookProps | LinkLookProps;

export function AppLink(props: AppLinkProps) {
  const { href } = props;
  const router = useRouter();
  const isInternal = href.startsWith('/');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isInternal) {
      router.prefetch(href);
    }
  }, [router, href, isInternal]);

  function handleClick(event: MouseEvent) {
    const isModified =
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0;
    if (!isInternal || isModified || event.defaultPrevented) {
      return;
    }
    setLoading(true);
    event.preventDefault();
    router.push(href);
  }

  if (props.as === 'button') {
    const { variant, size, className, children } = props;
    return (
      <dap-ds-button
        href={href}
        variant={variant}
        size={size}
        className={className}
        loading={loading}
        onClick={handleClick}
      >
        {children}
      </dap-ds-button>
    );
  }

  const { variant, size, bold, noUnderline, className, children } = props;
  return (
    <dap-ds-link
      href={href}
      variant={variant}
      size={size}
      bold={bold}
      noUnderline={noUnderline}
      className={className}
      onClick={handleClick}
    >
      {children}
    </dap-ds-link>
  );
}
