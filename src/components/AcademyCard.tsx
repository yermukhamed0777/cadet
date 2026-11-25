import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, CheckCircle2 } from 'lucide-react';
import type { Academy } from '../types';
import { academyService } from '../services/academyService';
import { pluralRu } from '../utils/format';

export function AcademyCard({ academy, selected, index }: { academy: Academy; selected?: boolean; index?: number }) {
  const count = academyService.specialties(academy.id).length;
  return (
    <Link
      to={`/academies/${academy.id}`}
      className={`group flex items-stretch gap-3 rounded-xl2 border bg-white p-4 shadow-card transition active:scale-[0.99] hover:shadow-lift ${
        selected ? 'border-gold ring-1 ring-gold' : 'border-line'
      }`}
    >
      <div className="flex w-11 shrink-0 flex-col items-center justify-start">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-navy font-display text-lg font-semibold text-gold">
          {index != null ? String(index + 1) : academy.city[0]}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15.5px] font-semibold leading-snug text-ink [overflow-wrap:anywhere]">{academy.title}</h3>
        <p className="mt-1.5 flex items-center gap-1 text-[13px] text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {academy.city}
          <span aria-hidden>·</span>
          {count} {pluralRu(count, ['program', 'programs', 'programs'])} in the catalog
        </p>
        {selected && (
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[12px] font-semibold text-navy">
            <CheckCircle2 className="h-3.5 w-3.5 text-gold-dark" aria-hidden /> Your academy
          </p>
        )}
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 self-center text-muted transition group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
