import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/** Модальное окно: bottom sheet на телефоне, диалог по центру на desktop */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => panelRef.current?.querySelector<HTMLElement>('[data-autofocus], button')?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
      <div className="absolute inset-0 bg-navy/60" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[90vh] w-full max-w-md animate-sheet overflow-y-auto rounded-t-2xl bg-white p-5 shadow-lift sm:m-4 sm:rounded-2xl"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line sm:hidden" aria-hidden />
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold leading-snug text-ink">{title}</h2>
          <button onClick={onClose} className="-mr-2 -mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted hover:bg-page" aria-label="Закрыть">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="text-[15px] text-ink">{children}</div>
        {footer && <div className="mt-5 flex flex-col gap-2">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
