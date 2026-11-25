import { FlaskConical } from 'lucide-react';

export function DemoBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2.5 text-[12.5px] leading-snug text-amber-900 ${className}`}>
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>
        <b>Demo mode.</b> This isn't real authentication: your account and data are stored only in this browser on this device.
      </p>
    </div>
  );
}
