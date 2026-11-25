import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type Kind = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  kind: Kind;
  text: string;
}

export const ToastContext = createContext<{ show: (text: string, kind?: Kind) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const show = useCallback((text: string, kind: Kind = 'success') => {
    const id = ++idRef.current;
    setToasts((t) => [...t.slice(-2), { id, kind, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ show }), [show]);
  const Icon = { success: CheckCircle2, error: AlertTriangle, info: Info };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
        aria-live="polite"
        role="status"
      >
        {toasts.map((t) => {
          const I = Icon[t.kind];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex w-full max-w-md animate-sheet items-start gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lift ${
                t.kind === 'error' ? 'bg-red-700 text-white' : t.kind === 'info' ? 'bg-navy-dark text-white' : 'bg-navy text-white'
              }`}
            >
              <I className={`mt-0.5 h-4 w-4 shrink-0 ${t.kind === 'success' ? 'text-gold' : ''}`} aria-hidden />
              <span>{t.text}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
