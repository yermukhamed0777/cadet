import { academyService } from '../services/academyService';
import { AcademyCard } from '../components/AcademyCard';
import { LogoMark } from '../components/ui';
import { useAppState } from '../hooks/useAppState';

/** Right after registration: the service academies in a vertical list (no comparison) */
export function OnboardingAcademiesPage() {
  const { state } = useAppState();
  const name = state.profile?.firstName;
  return (
    <div id="main-content" tabIndex={-1} className="min-h-screen bg-page px-4 pb-10" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)' }}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gold-dark">Step 2 of 2</p>
            <h1 className="text-xl font-semibold leading-tight text-ink">{name ? `${name}, select an academy` : 'Select an academy'}</h1>
          </div>
        </div>
        <p className="mb-4 text-sm text-muted">
          U.S. service academies. Open an academy to explore its programs and eligibility requirements.
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
