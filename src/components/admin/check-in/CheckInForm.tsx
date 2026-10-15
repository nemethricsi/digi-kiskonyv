'use client';

import { useEffect, useRef, useState, useTransition } from 'react';

import { Banner, Button, TextInput } from '@payloadcms/ui';

import { redeemCode } from '@/components/admin/check-in/actions';

import type { RedeemResult } from '@/components/admin/check-in/actions';

// A barcode scanner is a keyboard: it types the code and presses Enter, so a plain form is
// enough. After each attempt the input is cleared and focused again for the next citizen.
export function CheckInForm() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<RedeemResult>();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Ready for the scanner when the view opens (TextInput has no autoFocus prop)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!code.trim() || isPending) {
      return;
    }
    startTransition(async () => {
      setResult(await redeemCode(code));
      setCode('');
      inputRef.current?.focus();
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <TextInput
        path="code"
        label="Megjelenési kód"
        description="Olvassa be a QR-kódot, vagy írja be az állampolgár által mondott 6 számjegyet."
        value={code}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setCode(event.target.value)
        }
        inputRef={inputRef as React.RefObject<HTMLInputElement>}
        htmlAttributes={{ autoComplete: 'off' }}
        readOnly={isPending}
      />
      <Button type="submit" disabled={isPending || !code.trim()}>
        {isPending ? 'Rögzítés…' : 'Megjelenés rögzítése'}
      </Button>

      {/* <output> has an implicit role="status": the result is read out by screen readers */}
      <output aria-live="polite" style={{ display: 'block' }}>
        {result?.status === 'success' && (
          <Banner type="success">
            Megjelenés rögzítve: <strong>{result.citizenName}</strong> –{' '}
            {result.appointmentTitle}
          </Banner>
        )}
        {result?.status === 'error' && (
          <Banner type="error">{result.message}</Banner>
        )}
      </output>
    </form>
  );
}
