import { Link } from 'react-router-dom';
import { Clock, GraduationCap, CheckCircle2 } from 'lucide-react';
import type { Specialty } from '../types';
import { StatusBadge } from './ui';

export function SpecialtyCard({ s, selected }: { s: Specialty; selected?: boolean }) {
  return (
    <article className={`rounded-xl2 border bg-white p-4 shadow-card ${selected ? 'border-gold ring-1 ring-gold' : 'border-line'}`}>
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {s.code && <span className="rounded-md bg-navy px-1.5 py-0.5 font-mono text-[11.5px] font-semibold tracking-wide text-gold">{s.code}</span>}
        <StatusBadge status={s.status} year={s.applicableYear} />
      </div>
      <h3 className="text-[16px] font-semibold leading-snug text-ink [overflow-wrap:anywhere] [text-wrap:balance]">{s.title}</h3>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {s.duration ?? 'Duration: no data'}
        </span>
        <span className="inline-flex items-center gap-1">
          <GraduationCap className="h-3.5 w-3.5" aria-hidden />
          {s.level}
        </span>
      </div>
      <p className="mt-2 line-clamp-3 text-[14px] leading-snug text-ink/80">{s.summary ?? 'No verified program description found.'}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        {selected ? (
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-navy">
            <CheckCircle2 className="h-4 w-4 text-gold-dark" aria-hidden /> Selected
          </span>
        ) : (
          <span />
        )}
        <Link
          to={`/specialties/${s.id}`}
          className="inline-flex min-h-[44px] items-center rounded-xl bg-navy px-4 text-sm font-semibold text-white transition active:scale-[0.97] hover:bg-navy-dark"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
