import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card, EmptyState, ErrorState, LoadingState, StatusBadge, Tabs } from '../components/ui';
import { newsService } from '../services/newsService';
import { useAsync } from '../hooks/useAsync';
import { formatDate } from '../utils/format';

export function NewsPage() {
  const { data, loading, error, retry } = useAsync(() => newsService.list());
  const [tab, setTab] = useState<'2026' | 'archive'>('2026');
  const list = (data ?? []).filter((n) => (tab === '2026' ? n.applicableYear === 2026 : n.applicableYear !== 2026));

  return (
    <>
      <PageHeader title="News" back />
      <Tabs
        label="Period"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: '2026', label: '2026 — current' },
          { id: 'archive', label: '2025 — archive' },
        ]}
      />
      <div className="mt-4 flex flex-col gap-3">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState text={error} onRetry={retry} />
        ) : list.length === 0 ? (
          <EmptyState title="No articles" text="We only show verified official publications." />
        ) : (
          list.map((n) => (
            <Card key={n.id}>
              <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
                <time dateTime={n.date}>{formatDate(n.date)}</time>
                <StatusBadge status={n.status} year={n.applicableYear} />
              </div>
              <h2 className="font-semibold leading-snug text-ink [text-wrap:balance]">{n.title}</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink/85">{n.summary}</p>
              <p className="mt-2 text-[12.5px] text-muted">Source: {n.source}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={n.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-navy px-4 text-sm font-semibold text-white"
                >
                  Read source <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
                {n.secondaryUrl && (
                  <a href={n.secondaryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-line px-4 text-sm font-semibold text-navy">
                    Secondary source <ExternalLink className="h-4 w-4" aria-hidden />
                  </a>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
