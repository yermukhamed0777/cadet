export function ProgressBar({
  value,
  label,
  tone = 'gold',
  size = 'md',
}: {
  value: number;
  label: string;
  tone?: 'gold' | 'navy' | 'light';
  size?: 'sm' | 'md' | 'lg';
}) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const track = tone === 'light' ? 'bg-white/15' : 'bg-navy/10';
  const bar = tone === 'navy' ? 'bg-navy' : 'bg-gold';
  const h = size === 'lg' ? 'h-3' : size === 'sm' ? 'h-1.5' : 'h-2';
  return (
    <div className={`w-full overflow-hidden rounded-full ${track} ${h}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className={`${h} rounded-full ${bar} transition-[width] duration-700 ease-out`} style={{ width: `${pct}%` }} />
    </div>
  );
}
