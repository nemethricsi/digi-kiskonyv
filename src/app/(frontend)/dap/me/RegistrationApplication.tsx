'use client';

import { useState, useTransition } from 'react';

import { submitRegistration } from '@/app/(frontend)/dap/me/actions';

export function RegistrationApplication() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(undefined);
    startTransition(async () => {
      const result = await submitRegistration();
      if (result.status === 'error') {
        setError(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <dap-ds-button loading={isPending} onClick={handleClick}>
        Jelentkezés
      </dap-ds-button>
      {error && (
        <dap-ds-feedback feedbackType="negative" role="alert">
          {error}
        </dap-ds-feedback>
      )}
    </div>
  );
}
