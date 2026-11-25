import { ShieldCheck, Archive, AlertCircle } from 'lucide-react';
import type { VerificationStatus } from '../../types';

export function statusLabel(status: VerificationStatus, year: number | null) {
  if (status === 'verified') return year === 2026 ? 'Current for 2026' : year ? `Verified · ${year}` : 'Verified · year not listed';
  if (status === 'archive') return `Archive · ${year ?? '2025'}`;
  return 'Needs review';
}

export function StatusBadge({ status, year }: { status: VerificationStatus; year: number | null }) {
  const map = {
    verified: { cls: 'bg-emerald-50 text-emerald-800 border-emerald-200', Icon: ShieldCheck },
    archive: { cls: 'bg-slate-100 text-slate-700 border-slate-200', Icon: Archive },
    needs_review: { cls: 'bg-amber-50 text-amber-800 border-amber-200', Icon: AlertCircle },
  }[status];
  const { Icon } = map;
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold ${map.cls}`}>
      <Icon className="h-3 w-3" aria-hidden />
      {statusLabel(status, year)}
    </span>
  );
}
