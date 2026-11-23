import { academyService } from '../services/academyService';
import { AcademyCard } from '../components/AcademyCard';
import { LogoMark } from '../components/ui';
import { useAppState } from '../hooks/useAppState';

/** Сразу после регистрации: четыре учреждения МВД вертикальным списком (без сравнения) */
export function OnboardingAcademiesPage() {
  const { state } = useAppState();
  const name = state.profile?.firstName;
  return (
    <div className="min-h-screen bg-page px-4 pb-10" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)' }}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gold-dark">Шаг 2 из 2</p>
            <h1 className="text-xl font-semibold leading-tight text-ink">{name ? `${name}, выберите академию` : 'Выберите академию'}</h1>
          </div>
        </div>
        <p className="mb-4 text-sm text-muted">
          Ведомственные вузы МВД Республики Казахстан. Откройте учреждение, чтобы изучить программы и требования.
        </p>
        <div className="flex flex-col gap-3">
          {academyService.list().map((a, i) => (
            <AcademyCard key={a.id} academy={a} index={i} selected={state.selectedAcademy === a.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
