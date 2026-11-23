import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui';
import { useAppState } from '../hooks/useAppState';
import { useToast } from '../hooks/useToast';
import type { NotificationSettings } from '../types';

const topics: { id: keyof NotificationSettings; label: string; text: string }[] = [
  { id: 'vvk', label: 'ВВК', text: 'Напоминания о документах и обследованиях' },
  { id: 'fitness', label: 'Физическая подготовка', text: 'Напоминания о нормативах' },
  { id: 'documents', label: 'Документы', text: 'Статусы чеклиста документов' },
  { id: 'news', label: 'Новости', text: 'Официальные публикации МВД и академий' },
];

export function NotificationSettingsPage() {
  const { state, setNotificationSettings } = useAppState();
  const toast = useToast();
  const s = state.notificationSettings;
  return (
    <>
      <PageHeader title="Настройки уведомлений" back="/profile" />
      <Card className="!p-0">
        <ul>
          {topics.map((t) => (
            <li key={t.id} className="border-b border-line last:border-0">
              <label className="flex min-h-[64px] cursor-pointer items-center gap-3 px-4 py-3">
                <span className="flex-1">
                  <span className="block font-medium">{t.label}</span>
                  <span className="block text-[13px] text-muted">{t.text}</span>
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  className="peer sr-only"
                  checked={s[t.id]}
                  onChange={(e) => {
                    setNotificationSettings({ ...s, [t.id]: e.target.checked });
                    toast(e.target.checked ? `«${t.label}» включены` : `«${t.label}» выключены`, 'info');
                  }}
                />
                <span
                  className="relative h-7 w-12 shrink-0 rounded-full bg-navy/20 transition peer-checked:bg-gold peer-focus-visible:ring-2 peer-focus-visible:ring-navy after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5"
                  aria-hidden
                />
              </label>
            </li>
          ))}
        </ul>
      </Card>
      <p className="mt-3 text-[12.5px] leading-snug text-muted">
        Настройки управляют уведомлениями внутри приложения. Push-уведомления на телефон появятся после подключения backend (см. README).
      </p>
    </>
  );
}
