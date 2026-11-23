import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Landmark, GraduationCap, Bell, LogOut, ChevronRight, LifeBuoy, Newspaper } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button, Card, Modal, SectionTitle } from '../components/ui';
import { DemoBanner } from '../components/DemoBanner';
import { useAppState } from '../hooks/useAppState';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { academyService } from '../services/academyService';
import { formatDate } from '../utils/format';

export function ProfilePage() {
  const { state } = useAppState();
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const p = state.profile!;
  const academy = academyService.get(state.selectedAcademy ?? undefined);
  const spec = academyService.specialty(state.selectedSpecialty);

  const rows: [string, string][] = [
    ['ФИО', [p.lastName, p.firstName, p.middleName].filter(Boolean).join(' ')],
    ['Дата рождения', formatDate(p.birthDate)],
    ['Город', p.city],
    ['Пол', p.gender === 'male' ? 'Мужской' : 'Женский'],
    ['Email', session?.user.email ?? '—'],
    ['Академия', academy?.title ?? 'Не выбрана'],
    ['Специальность', spec ? `${spec.code ? spec.code + ' · ' : ''}${spec.title}` : 'Не выбрана'],
  ];

  const actions = [
    { to: '/profile/edit', label: 'Редактировать профиль', Icon: Pencil },
    { to: '/academies', label: 'Изменить академию', Icon: Landmark },
    { to: academy ? `/academies/${academy.id}/specialties` : '/academies', label: 'Изменить специальность', Icon: GraduationCap },
    { to: '/profile/notifications', label: 'Настройки уведомлений', Icon: Bell },
    { to: '/news', label: 'Новости', Icon: Newspaper },
    { to: '/support', label: 'Поддержка', Icon: LifeBuoy },
  ];

  return (
    <>
      <PageHeader title="Профиль" />
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-navy font-display text-xl font-semibold text-gold">
          {(p.firstName[0] ?? '') + (p.lastName[0] ?? '')}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{p.firstName} {p.lastName}</p>
          <p className="truncate text-sm text-muted">{session?.user.email}</p>
        </div>
      </div>
      {session?.isDemo && <DemoBanner className="mb-4" />}
      <Card className="!py-1">
        <dl>
          {rows.map(([k, v]) => (
            <div key={k} className="border-b border-line py-2.5 last:border-0">
              <dt className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">{k}</dt>
              <dd className="mt-0.5 text-[15px] leading-snug [overflow-wrap:anywhere]">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <SectionTitle>Действия</SectionTitle>
      <Card className="!p-0">
        <ul>
          {actions.map(({ to, label, Icon }) => (
            <li key={label} className="border-b border-line last:border-0">
              <Link to={to} className="flex min-h-[54px] items-center gap-3 px-4 font-medium">
                <Icon className="h-5 w-5 text-navy" aria-hidden />
                <span className="flex-1">{label}</span>
                <ChevronRight className="h-5 w-5 text-muted" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
      <Button variant="danger" full className="mt-4" icon={<LogOut className="h-4 w-4" />} onClick={() => setConfirm(true)}>
        Выйти
      </Button>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Выйти из аккаунта?"
        footer={
          <>
            <Button
              variant="danger"
              full
              loading={busy}
              onClick={async () => {
                setBusy(true);
                await logout();
                setBusy(false);
                setConfirm(false);
                toast('Вы вышли из аккаунта', 'info');
                navigate('/login', { replace: true });
              }}
            >
              Выйти
            </Button>
            <Button variant="secondary" full onClick={() => setConfirm(false)} data-autofocus>
              Отмена
            </Button>
          </>
        }
      >
        <p className="text-muted">{session?.isDemo ? 'Данные демо-аккаунта останутся на этом устройстве — вы сможете войти снова.' : 'Вы сможете войти снова в любой момент.'}</p>
      </Modal>
    </>
  );
}
