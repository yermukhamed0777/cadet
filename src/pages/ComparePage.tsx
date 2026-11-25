import { ExternalLink } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button, Card, EmptyState, NoData, SectionTitle } from '../components/ui';
import { academyService } from '../services/academyService';
import { useAppState } from '../hooks/useAppState';
import { useToast } from '../hooks/useToast';
import type { Academy, Fact } from '../types';
import { StatusBadge } from '../components/ui';

type Row = { label: string; get: (a: Academy) => Fact<string | string[]> | { value: string | string[] | null; status?: undefined } };

const factText = (v: string | string[] | null) => (v == null || (Array.isArray(v) && !v.length) ? null : Array.isArray(v) ? v.join('; ') : v);

// Compare only objective facts. Fitness scores, rankings and estimates are deliberately excluded.
const rows: Row[] = [
  { label: 'City', get: (a) => ({ value: a.city }) },
  { label: 'Address', get: (a) => a.address },
  { label: 'Founded', get: (a) => a.founded },
  {
    label: 'Programs',
    get: (a) => ({ value: academyService.specialties(a.id).map((s) => (s.code ? `${s.code} ${s.title}` : s.title)) }),
  },
  {
    label: 'Duration',
    get: (a) => {
      const d = Array.from(new Set(academyService.specialties(a.id).map((s) => s.duration).filter(Boolean))) as string[];
      return { value: d.length ? d : null };
    },
  },
  { label: 'Study conditions', get: (a) => a.studyConditions },
  { label: 'Housing', get: (a) => a.dormitory },
  { label: 'Meals', get: (a) => a.meals },
  { label: 'Stipend', get: (a) => a.stipend },
  { label: 'Official contacts', get: (a) => ({ value: a.contacts.filter((c) => c.kind !== 'web').map((c) => `${c.label}: ${c.value}`) }) },
];

export function ComparePage() {
  const { state, toggleCompare, clearCompare } = useAppState();
  const toast = useToast();
  const all = academyService.list();
  const chosen = state.compare.map((id) => academyService.get(id)!).filter(Boolean);

  return (
    <>
      <PageHeader title="Compare academies" subtitle="Up to 3 academies" back />
      <p className="mb-3 text-[13px] leading-snug text-muted">
        Only objective data from official sources. No rankings, scores, or recommendations — the choice is yours.
      </p>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Select academies ({chosen.length}/3)</legend>
        <div className="flex flex-col gap-2">
          {all.map((a) => {
            const on = state.compare.includes(a.id);
            const disabled = !on && state.compare.length >= 3;
            return (
              <label
                key={a.id}
                className={`flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border bg-white px-3.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${on ? 'border-navy' : 'border-line'} ${disabled ? 'opacity-50' : ''}`}
              >
                <input
                  type="checkbox"
                  className="h-5 w-5 shrink-0 accent-[#071A2F]"
                  checked={on}
                  disabled={disabled}
                  onChange={() => {
                    if (!toggleCompare(a.id)) toast('You can select up to 3 academies', 'error');
                  }}
                />
                <span className="text-[14.5px] font-medium leading-snug">{a.title}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {chosen.length > 0 && (
        <Button variant="ghost" size="sm" className="mt-2" onClick={clearCompare}>
          Clear selection
        </Button>
      )}

      {chosen.length < 2 ? (
        <div className="mt-4">
          <EmptyState title="Select at least 2 academies" text="Your comparison will appear here." />
        </div>
      ) : (
        <>
          {rows.map((r) => (
            <section key={r.label}>
              <SectionTitle>{r.label}</SectionTitle>
              <Card className="!p-0">
                <ul>
                  {chosen.map((a) => {
                    const f = r.get(a);
                    const text = factText(f.value);
                    return (
                      <li key={a.id} className="border-b border-line px-4 py-3 last:border-0">
                        <p className="text-[12px] font-semibold text-navy-600">{a.shortTitle}</p>
                        <p className="mt-0.5 text-[14px] leading-snug [overflow-wrap:anywhere]">{text ?? <NoData />}</p>
                        {text && 'status' in f && f.status && (
                          <div className="mt-1">
                            <StatusBadge status={f.status} year={(f as Fact).applicableYear} />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </section>
          ))}
          <SectionTitle>Official website</SectionTitle>
          <Card className="!p-0">
            <ul>
              {chosen.map((a) => (
                <li key={a.id} className="border-b border-line last:border-0">
                  <a href={a.website} target="_blank" rel="noopener noreferrer" className="flex min-h-[52px] items-center justify-between gap-2 px-4 font-semibold text-navy">
                    {a.shortTitle} <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </>
  );
}
