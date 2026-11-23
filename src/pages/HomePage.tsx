import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Stethoscope, Dumbbell, Newspaper, Scale, LifeBuoy, MapPinned, Landmark } from 'lucide-react';
import { NotificationBell } from '../components/NotificationBell';
import { Card, ProgressBar, SectionTitle, StatusBadge } from '../components/ui';
import { useAppState, usePath } from '../hooks/useAppState';
import { academyService } from '../services/academyService';
import { news } from '../data/news';
import { formatDate } from '../utils/format';
import { DemoBanner } from '../components/DemoBanner';
import { useAuth } from '../hooks/useAuth';

const quick = [
  { to: '/documents', label: 'Документы', Icon: FileText },
  { to: '/vvk', label: 'ВВК', Icon: Stethoscope },
  { to: '/fitness', label: 'Нормативы', Icon: Dumbbell },
  { to: '/news', label: 'Новости', Icon: Newspaper },
  { to: '/compare', label: 'Сравнение', Icon: Scale },
  { to: '/vvk/map', label: 'ВВК на карте', Icon: MapPinned },
  { to: '/support', label: 'Поддержка', Icon: LifeBuoy },
  { to: '/academies', label: 'Академии', Icon: Landmark },
];

export function HomePage() {
  const { state } = useAppState();
  const { session } = useAuth();
  const { percent, done, total, next } = usePath();
  const academy = academyService.get(state.selectedAcademy ?? undefined);
  const spec = academyService.specialty(state.selectedSpecialty);
  const latest = [...news].sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <>
      <header
        className="-mx-4 mb-4 bg-navy px-4 pb-20 text-white"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)' }}
      >
        <div className="mx-auto flex max-w-2xl items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gold">Bolashaq Kursant</p>
            <h1 className="mt-2 truncate text-[26px] font-semibold leading-tight">Привет, {state.profile?.firstName}</h1>
            <p className="text-sm text-white/65">Твой путь в академию</p>
          </div>
          <NotificationBell />
        </div>
      </header>

      <div className="-mt-[88px] flex flex-col gap-3">
        <Card>
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Твоя академия</p>
          {academy ? (
            <Link to={`/academies/${academy.id}`} className="mt-0.5 block font-semibold leading-snug text-ink [overflow-wrap:anywhere]">
              {academy.title}
            </Link>
          ) : (
            <Link to="/academies" className="mt-1 inline-flex min-h-[36px] items-center gap-1 font-semibold text-navy-600">
              Выбрать академию <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
          <div className="my-3 h-px bg-line" />
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Специальность</p>
          {spec ? (
            <Link to={`/specialties/${spec.id}`} className="mt-0.5 block font-semibold leading-snug text-ink [overflow-wrap:anywhere]">
              {spec.code ? `${spec.code} · ` : ''}
              {spec.title}
            </Link>
          ) : (
            <Link
              to={academy ? `/academies/${academy.id}/specialties` : '/academies'}
              className="mt-1 inline-flex min-h-[36px] items-center gap-1 font-semibold text-navy-600"
            >
              Выбрать специальность <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </Card>

        <Link to="/my-path" className="block rounded-xl2 bg-navy-dark p-5 text-white shadow-lift transition active:scale-[0.99]">
          <div className="flex items-baseline justify-between">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/60">Готовность</p>
            <p className="text-[12px] text-white/60 tabular-nums">
              {done} / {total} этапов
            </p>
          </div>
          <p className="mt-1 font-display text-[56px] font-semibold leading-none text-gold tabular-nums">{percent}%</p>
          <div className="mt-3">
            <ProgressBar value={percent / 100} label="Готовность к поступлению" tone="light" size="lg" />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[12px] text-white/60">Следующий шаг:</p>
              <p className="truncate font-semibold">{next ? next.title : 'Все этапы отмечены'}</p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-navy">
              <ArrowRight className="h-5 w-5" aria-hidden />
            </span>
          </div>
        </Link>
      </div>

      <SectionTitle>Разделы</SectionTitle>
      <div className="grid grid-cols-4 gap-2">
        {quick.map(({ to, label, Icon }) => (
          <Link key={to} to={to} className="flex min-h-[84px] flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-0.5 py-1.5 text-center shadow-card transition active:scale-95">
            <Icon className="h-5 w-5 text-navy" aria-hidden />
            <span className="text-[11px] font-semibold leading-tight text-ink">{label}</span>
          </Link>
        ))}
      </div>

      {latest && (
        <>
          <SectionTitle action={<Link to="/news" className="py-1 text-sm font-semibold text-navy-600">Все</Link>}>Новости</SectionTitle>
          <Link to="/news" className="block">
            <Card>
              <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[12px] text-muted">
                <span>{formatDate(latest.date)}</span>
                <StatusBadge status={latest.status} year={latest.applicableYear} />
              </div>
              <p className="font-semibold leading-snug text-ink">{latest.title}</p>
              <p className="mt-1 text-[12.5px] text-muted">{latest.publisher}</p>
            </Card>
          </Link>
        </>
      )}

      {session?.isDemo && <DemoBanner className="mt-5" />}
    </>
  );
}
