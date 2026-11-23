import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useUnreadCount } from '../hooks/useAppState';

export function NotificationBell({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const unread = useUnreadCount();
  return (
    <Link
      to="/notifications"
      className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full ${tone === 'dark' ? 'text-white hover:bg-white/10' : 'text-navy hover:bg-navy/5'}`}
      aria-label={unread ? `Уведомления: ${unread} непрочитанных` : 'Уведомления'}
    >
      <Bell className="h-[22px] w-[22px]" />
      {unread > 0 && (
        <span className="absolute right-1.5 top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-navy">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  );
}
