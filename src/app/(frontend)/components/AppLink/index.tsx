'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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

/**
 * Navigation that looks like a DÁP button or link, and always renders an <a> (both components
 * render one when they get `href`). Plain left clicks on internal paths navigate client-side;
 * modifier / middle clicks and external URLs keep the browser's default behaviour.
 */
export function AppLink(props: AppLinkProps) {
  const { href } = props;
  const router = useRouter();
  const isInternal = href.startsWith('/');

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
