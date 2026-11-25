import type { ReactNode } from 'react';
import { Loader2, Inbox, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export function LoadingState({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted" role="status">
      <Loader2 className="h-7 w-7 animate-spin text-navy" aria-hidden />
      <span className="text-sm">{text}</span>
    </div>
  );
}

export function EmptyState({ title, text, action, icon }: { title: string; text?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl2 border border-dashed border-line bg-white px-5 py-10 text-center">
      <div className="mb-1 text-muted">{icon ?? <Inbox className="h-8 w-8" aria-hidden />}</div>
      <p className="font-semibold text-ink">{title}</p>
      {text && <p className="max-w-xs text-sm text-muted">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({ text, onRetry }: { text: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl2 border border-red-200 bg-red-50 px-5 py-8 text-center" role="alert">
      <AlertTriangle className="h-7 w-7 text-red-700" aria-hidden />
      <p className="text-sm font-medium text-red-800">{text}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
