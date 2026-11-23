import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

/** Верхняя панель страницы: назад, заголовок, колокольчик уведомлений */
export function PageHeader({ title, back, subtitle, right }: { title: string; back?: string | true; subtitle?: ReactNode; right?: ReactNode }) {
  const navigate = useNavigate();
  const goBack = () => {
    if (back === true) {
      if (window.history.length > 1) navigate(-1);
      else navigate('/home');
    } else if (back) navigate(back);
  };
  return (
    <header
      className="sticky z-30 -mx-4 mb-4 border-b border-white/5 bg-navy px-4 pb-3 text-white"
      style={{ top: 0, paddingTop: 'calc(env(safe-area-inset-top, 0px) + 10px)' }}
    >
      <div className="mx-auto flex max-w-2xl items-center gap-2">
        {back && (
          <button onClick={goBack} className="-ml-2 grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-white/10" aria-label="Назад">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[17px] font-semibold leading-tight">{title}</h1>
          {subtitle && <p className="truncate text-[12.5px] text-white/60">{subtitle}</p>}
        </div>
        {right}
        <NotificationBell />
      </div>
    </header>
  );
}
