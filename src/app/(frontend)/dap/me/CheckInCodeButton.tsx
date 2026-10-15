'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';

import { requestCheckInCode } from '@/app/(frontend)/dap/me/actions';

import type { RequestCheckInCodeResult } from '@/app/(frontend)/dap/me/actions';

/** A new code is requested this long before the current one expires */
const REFRESH_BEFORE_SECONDS = 10;

type ActiveCode = Extract<RequestCheckInCodeResult, { status: 'success' }> & {
  /** Client clock: expiresInSeconds counted from when the response arrived */
  deadline: number;
};

// "482913" → "482 913": easier to read out loud and to type
const formatCode = (code: string) => `${code.slice(0, 3)} ${code.slice(3)}`;

export function CheckInCodeButton({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeCode, setActiveCode] = useState<ActiveCode>();
  const [error, setError] = useState<string>();
  const [now, setNow] = useState(() => Date.now());
  const [isPending, startTransition] = useTransition();

  const fetchCode = useCallback(() => {
    startTransition(async () => {
      const result = await requestCheckInCode(appointmentId);
      if (result.status === 'error') {
        setActiveCode(undefined);
        setError(result.message);
        return;
      }
      setError(undefined);
      setActiveCode({
        ...result,
        deadline: Date.now() + result.expiresInSeconds * 1000,
      });
    });
  }, [appointmentId]);

  // Countdown tick, only while the modal is open
  useEffect(() => {
    if (!open) {
      return;
    }
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [open]);

  const secondsLeft = activeCode
    ? Math.max(0, Math.ceil((activeCode.deadline - now) / 1000))
    : 0;

  // Rotate the code before it expires
  useEffect(() => {
    if (
      open &&
      activeCode &&
      secondsLeft <= REFRESH_BEFORE_SECONDS &&
      !isPending
    ) {
      fetchCode();
    }
  }, [open, activeCode, secondsLeft, isPending, fetchCode]);

  function handleOpen() {
    setNow(Date.now());
    setOpen(true);
    fetchCode();
  }

  function handleClosed() {
    setOpen(false);
    setActiveCode(undefined);
    setError(undefined);
  }

  return (
    <>
      <dap-ds-button variant="subtle" size="sm" onClick={handleOpen}>
        Pecsét
      </dap-ds-button>

      <dap-ds-modal
        open={open}
        title="Megjelenési kód"
        description="Mutassa fel az ügyintézőnek, vagy olvassa fel a számokat."
        footer="false"
        ondds-closed={handleClosed}
      >
        <div className="flex flex-col items-center gap-4 py-2">
          {error ? (
            <dap-ds-feedback feedbackType="negative" role="alert">
              {error}
            </dap-ds-feedback>
          ) : activeCode ? (
            <>
              {/* oxlint-disable-next-line nextjs/no-img-element -- data URI, nothing for next/image to optimize */}
              <img
                src={activeCode.qrImageSrc}
                alt={`QR-kód: ${formatCode(activeCode.code)}`}
                className="size-56"
              />
              <p className="text-4xl font-bold tracking-widest text-text-strong tabular-nums">
                {formatCode(activeCode.code)}
              </p>
              <div className="w-full">
                <dap-ds-progress
                  value={secondsLeft}
                  max={activeCode.ttlSeconds}
                  label={`Még ${secondsLeft} másodpercig érvényes, utána automatikusan frissül.`}
                />
              </div>
            </>
          ) : (
            <dap-ds-spinner text="Kód kérése…" />
          )}
        </div>
      </dap-ds-modal>
    </>
  );
}
