import { useNavigate, Link } from 'react-router-dom';
import { BellOff, Settings, Stethoscope, Dumbbell, FileText, Newspaper, Bell } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button, EmptyState } from '../components/ui';
import { useAppState } from '../hooks/useAppState';
import { formatDate } from '../utils/format';

const icons = { vvk: Stethoscope, fitness: Dumbbell, documents: FileText, news: Newspaper, system: Bell };

export function NotificationsPage() {
  const { state, markNotificationRead, markAllNotificationsRead } = useAppState();
  const navigate = useNavigate();
  const settings = state.notificationSettings;
  const list = state.notifications
    .filter((n) => n.topic === 'system' || settings[n.topic as keyof typeof settings] !== false)
    .sort((a, b) => b.date.localeCompare(a.date));
  const unread = list.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader
        title="Уведомления"
        subtitle={unread ? `Непрочитанных: ${unread}` : 'Все прочитаны'}
        back
        right={
          <Link to="/profile/notifications" className="grid h-11 w-11 place-items-center rounded-full text-white hover:bg-white/10" aria-label="Настройки уведомлений">
            <Settings className="h-5 w-5" />
          </Link>
        }
      />
      {list.length === 0 ? (
        <EmptyState icon={<BellOff className="h-8 w-8" aria-hidden />} title="Уведомлений нет" text="Включите темы в настройках уведомлений." />
      ) : (
        <>
          <div className="mb-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={markAllNotificationsRead} disabled={!unread}>
              Прочитать все
            </Button>
          </div>
          <ul className="flex flex-col gap-2">
            {list.map((n) => {
              const I = icons[n.topic];
              return (
                <li key={n.id} className={`flex rounded-xl2 border bg-white shadow-card ${n.read ? 'border-line' : 'border-gold/60'}`}>
                  <button
                    className="flex min-w-0 flex-1 items-start gap-3 p-4 text-left"
                    onClick={() => {
                      markNotificationRead(n.id);
                      navigate(n.link);
                    }}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${n.read ? 'bg-page text-muted' : 'bg-navy text-gold'}`}>
                      <I className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-ink">{n.title}</span>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-gold" aria-label="Не прочитано" />}
                      </span>
                      <span className="mt-0.5 block text-[14px] leading-snug text-ink/85">{n.body}</span>
                      <span className="mt-1 block text-[12px] text-muted">{formatDate(n.date)}</span>
                    </span>
                  </button>
                  <button
                    onClick={() => markNotificationRead(n.id, !n.read)}
                    className="shrink-0 self-start px-3 py-4 text-[12px] font-semibold text-navy-600"
                    aria-label={n.read ? 'Отметить как непрочитанное' : 'Отметить как прочитанное'}
                  >
                    {n.read ? 'Не прочит.' : 'Прочитано'}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
