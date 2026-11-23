import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Fact, SourceRef } from '../types';
import { NoData, StatusBadge } from './ui';

export function InlineSource({ refData }: { refData: SourceRef }) {
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted">
      <StatusBadge status={refData.status} year={refData.applicableYear} />
      {refData.sourceUrl ? (
        <a href={refData.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[28px] items-center gap-1 font-semibold text-navy-600 hover:underline">
          {refData.source} <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
        </a>
      ) : (
        <span>{refData.source}</span>
      )}
      {refData.note && <span className="w-full leading-snug">{refData.note}</span>}
    </div>
  );
}

export function FactRow({ label, fact, render }: { label: string; fact: Fact<string | string[]>; render?: (v: string | string[]) => ReactNode }) {
  const v = fact.value;
  return (
    <div className="border-b border-line py-3 last:border-0">
      <dt className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">{label}</dt>
      <dd className="mt-1 text-[15px] leading-snug text-ink [overflow-wrap:anywhere]">
        {v == null || (Array.isArray(v) && !v.length) ? (
          <NoData />
        ) : render ? (
          render(v)
        ) : Array.isArray(v) ? (
          <ul className="list-disc space-y-0.5 pl-5">
            {v.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        ) : (
          v
        )}
        {v != null && <InlineSource refData={fact} />}
      </dd>
    </div>
  );
}
