'use client';

import { useState } from 'react';

import { Banner, Button, ConfirmationModal, useModal } from '@payloadcms/ui';

import { resetDemo } from '@/components/admin/reset-demo/actions';

import type { ResetDemoResult } from '@/components/admin/reset-demo/actions';

const MODAL_SLUG = 'reset-demo';

export function ResetDemoButton() {
  const { openModal } = useModal();
  const [result, setResult] = useState<ResetDemoResult>();

  async function handleConfirm() {
    const response = await resetDemo();
    if (response.status === 'success') {
      // Every session was truncated too, so the current one is gone: full reload to the login
      window.location.assign('/admin/login');
      return;
    }
    setResult(response);
  }

  return (
    <>
      <Button buttonStyle="secondary" onClick={() => openModal(MODAL_SLUG)}>
        Adatbázis visszaállítása
      </Button>
      <ConfirmationModal
        modalSlug={MODAL_SLUG}
        heading="Biztosan visszaállítja a demóadatokat?"
        body="Minden állampolgár, nyilvántartásba vétel, időpont, megjelenés és felhasználó törlődik. Ez nem vonható vissza."
        confirmLabel="Visszaállítás"
        confirmingLabel="Visszaállítás…"
        cancelLabel="Mégse"
        onConfirm={handleConfirm}
      />
      <output aria-live="polite" style={{ display: 'block' }}>
        {result?.status === 'error' && (
          <Banner type="error">{result.message}</Banner>
        )}
      </output>
    </>
  );
}
