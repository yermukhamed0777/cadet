import { Link } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card, ProgressBar } from '../components/ui';
import { useAppState, usePath } from '../hooks/useAppState';
import { useToast } from '../hooks/useToast';
import { emit } from '../utils/events';

export function MyPathPage() {
  const { stages, percent, done, total } = usePath();
  const { state, setManualStage } = useAppState();
  const toast = useToast();

  return (
    <>
      <PageHeader title="My Path" subtitle="From sign-up to appointment" />
      <Card className="mb-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Your readiness</p>
            <p className="font-display text-4xl font-semibold text-navy tabular-nums">{percent}%</p>
          </div>
          <p className="text-sm text-muted tabular-nums">
            {done} of {total} steps
          </p>
        </div>
        <div className="mt-2">
          <ProgressBar value={percent / 100} label="Readiness" size="lg" />
        </div>
        <p className="mt-2 text-[12.5px] text-muted">Percentage = completed steps ÷ all steps. Steps are marked automatically as you use the app.</p>
      </Card>

      <ol className="relative">
        {stages.map((s, i) => {
          const last = i === stages.length - 1;
          const manualOn = s.manual ? Boolean(state.myPathProgress.manual[s.manual]) : false;
          return (
            <li key={s.id} className="relative flex gap-3 pb-4">
              {!last && <span className={`absolute left-[15px] top-8 h-[calc(100%-24px)] w-0.5 ${s.done ? 'bg-gold' : 'bg-line'}`} aria-hidden />}
              <span
                className={`z-10 mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-sm font-bold ${
                  s.done ? 'border-gold bg-gold text-navy' : 'border-line bg-white text-muted'
                }`}
                aria-hidden
              >
                {s.done ? <Check className="h-4 w-4 animate-pop" strokeWidth={3} /> : i + 1}
              </span>
              <div className="min-w-0 flex-1 rounded-xl2 border border-line bg-white p-3.5 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug text-ink">{s.title}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${s.done ? 'bg-emerald-50 text-emerald-800' : 'bg-page text-muted'}`}>
                    {s.done ? 'Complete' : 'Not complete'}
                  </span>
                </div>
                <p className="mt-1 text-[13.5px] leading-snug text-muted">{s.description}</p>
                {s.partial != null && !s.done && (
                  <div className="mt-2">
                    <ProgressBar value={s.partial} label={s.title} size="sm" tone="navy" />
                    <p className="mt-1 text-[12px] text-muted">{s.partialLabel}</p>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <Link to={s.link} className="inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-navy">
                    {s.linkLabel} <ChevronRight className="h-4 w-4" aria-hidden />
                  </Link>
                  {s.manual && (
                    <label className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 text-[13px] font-medium text-ink">
                      <input
                        type="checkbox"
                        className="h-5 w-5 accent-[#D9A441]"
                        checked={manualOn}
                        onChange={(e) => {
                          setManualStage(s.manual!, e.target.checked);
                          if (e.target.checked) emit('path_stage_completed');
                          toast(e.target.checked ? 'Step checked' : 'Check removed', 'info');
                        }}
                      />
                      {s.id === 'vvk' ? 'Medical exam passed' : 'Step complete'}
                    </label>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
