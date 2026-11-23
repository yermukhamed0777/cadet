import type { ReactNode } from 'react';
import { Wordmark } from '../components/ui';

/** Экран авторизации: тёмный бренд-блок сверху, форма на светлой карточке */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-navy">
      <div
        className="relative overflow-hidden px-5 pb-16"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 40px)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 14px)' }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-md">
          <Wordmark />
        </div>
      </div>
      <div className="relative -mt-8 min-h-[60vh] rounded-t-[28px] bg-page px-5 pb-10 pt-7">
        <div className="mx-auto max-w-md">{children}</div>
      </div>
    </div>
  );
}
