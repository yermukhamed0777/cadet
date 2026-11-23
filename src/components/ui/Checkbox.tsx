import { Check } from 'lucide-react';

export function CheckMark({ checked }: { checked: boolean }) {
  return (
    <span
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors ${
        checked ? 'border-gold bg-gold text-navy' : 'border-navy/25 bg-white'
      }`}
      aria-hidden
    >
      {checked && <Check className="h-4 w-4 animate-pop" strokeWidth={3} />}
    </span>
  );
}

export function Checkbox({ checked, onChange, label, id }: { checked: boolean; onChange: () => void; label: string; id: string }) {
  return (
    <label htmlFor={id} className="flex min-h-[44px] cursor-pointer items-center gap-3">
      <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span className="rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2">
        <CheckMark checked={checked} />
      </span>
      <span className={`text-[15px] font-medium ${checked ? 'text-muted line-through decoration-gold/60' : 'text-ink'}`}>{label}</span>
    </label>
  );
}
