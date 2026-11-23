import { useRef } from 'react';

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    refs.current[n]?.focus();
    onChange(tabs[n].id);
  };
  return (
    <div role="tablist" aria-label={label} className="grid gap-1 rounded-xl bg-navy/[0.06] p-1" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0,1fr))` }}>
      {tabs.map((t, i) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => (refs.current[i] = el)}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => onChange(t.id)}
            className={`min-h-[40px] rounded-lg px-1 text-[12.5px] font-semibold leading-tight transition ${
              active ? 'bg-white text-navy shadow-card' : 'text-muted hover:text-navy'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
