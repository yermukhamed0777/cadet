import { PageHeader } from '../components/PageHeader';
import { Accordion, Card, ProgressBar, SectionTitle, SourceLink } from '../components/ui';
import { documentCategories, documents } from '../data/documents';
import { useAppState } from '../hooks/useAppState';
import { documentStats } from '../utils/progress';
import { emit } from '../utils/events';
import type { DocStatus } from '../types';

const statuses: { id: DocStatus; label: string; cls: string }[] = [
  { id: 'not_ready', label: 'Not started', cls: 'peer-checked:bg-white peer-checked:text-ink peer-checked:border-navy/40' },
  { id: 'in_progress', label: 'In progress', cls: 'peer-checked:bg-amber-100 peer-checked:text-amber-900 peer-checked:border-amber-300' },
  { id: 'ready', label: 'Ready', cls: 'peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600' },
];

export function DocumentsPage() {
  const { state, setDocStatus } = useAppState();
  const { ready, inProgress, total } = documentStats(state);

  return (
    <>
      <PageHeader title="Documents" back />
      <Card className="mb-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-semibold">Document readiness</h2>
          <span className="text-sm font-semibold text-navy tabular-nums">
            {ready} / {total}
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar value={total ? ready / total : 0} label="Document readiness" size="lg" />
        </div>
        <p className="mt-2 text-[12.5px] text-muted">In progress: {inProgress}</p>
      </Card>
      <p className="mb-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] leading-snug text-amber-900">
        No current official document list was found. Copy counts and notarization are shown only where confirmed. Everything else is marked "Needs review against the admissions office's current requirements".
      </p>

      {documentCategories.map((cat) => {
        const list = documents.filter((d) => d.category === cat.id);
        if (!list.length) return null;
        return (
          <section key={cat.id}>
            <SectionTitle>{cat.title}</SectionTitle>
            <div className="flex flex-col gap-2">
              {list.map((d) => {
                const st = state.documentsProgress[d.id] ?? 'not_ready';
                return (
                  <Accordion
                    key={d.id}
                    header={
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-3 w-3 shrink-0 rounded-full ${st === 'ready' ? 'bg-emerald-600' : st === 'in_progress' ? 'bg-amber-400' : 'border-2 border-navy/25'}`}
                          aria-hidden
                        />
                        <span className="min-w-0">
                          <span className="block font-medium leading-snug text-ink">{d.title}</span>
                          <span className="block text-[12.5px] text-muted">Status: {statuses.find((s) => s.id === st)!.label}</span>
                        </span>
                      </div>
                    }
                  >
                    <p className="text-[14px] leading-snug text-ink/85">{d.description}</p>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                      <div className="rounded-lg bg-page p-2.5">
                        <dt className="text-muted">Copies required</dt>
                        <dd className="font-semibold">{d.copies ?? 'Needs review'}</dd>
                      </div>
                      <div className="rounded-lg bg-page p-2.5">
                        <dt className="text-muted">Notarization</dt>
                        <dd className="font-semibold">{d.notarized ?? 'Needs review'}</dd>
                      </div>
                    </dl>
                    <fieldset className="mt-3">
                      <legend className="mb-1.5 text-[13px] font-semibold">Status</legend>
                      <div className="grid grid-cols-3 gap-1.5">
                        {statuses.map((s) => (
                          <label key={s.id} className="relative">
                            <input
                              type="radio"
                              name={`st-${d.id}`}
                              className="peer sr-only"
                              checked={st === s.id}
                              onChange={() => {
                                setDocStatus(d.id, s.id);
                                emit('checklist_item_toggled');
                              }}
                            />
                            <span
                              className={`flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg border border-line bg-page px-1 text-center text-[12.5px] font-semibold text-muted transition active:scale-95 peer-focus-visible:ring-2 peer-focus-visible:ring-gold ${s.cls}`}
                            >
                              {s.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <div className="mt-3">
                      <SourceLink refData={d} compact />
                    </div>
                  </Accordion>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
