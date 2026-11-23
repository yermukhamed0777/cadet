import { ExternalLink } from 'lucide-react';
import type { SourceRef } from '../../types';
import { formatDate } from '../../utils/format';
import { StatusBadge } from './StatusBadge';

/** Блок «Источник» — показывается у каждого критически важного утверждения */
export function SourceLink({ refData, compact = false }: { refData: SourceRef; compact?: boolean }) {
  return (
    <div className={`rounded-lg bg-page ${compact ? 'p-2.5' : 'p-3'} text-[12.5px] leading-snug text-muted`}>
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <span className="font-semibold text-ink">Источник:</span>
        <StatusBadge status={refData.status} year={refData.applicableYear} />
      </div>
      <p className="break-words text-ink/80">{refData.source}</p>
      {refData.note && <p className="mt-1 break-words">{refData.note}</p>}
      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
        <span>Проверено: {formatDate(refData.checkedAt)}</span>
        {refData.sourceUrl && (
          <a
            href={refData.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[32px] items-center gap-1 font-semibold text-navy-600 underline-offset-2 hover:underline"
          >
            Открыть источник <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}

export function NoData({ text = 'Нет подтверждённых данных' }: { text?: string }) {
  return <span className="italic text-muted">{text}</span>;
}
