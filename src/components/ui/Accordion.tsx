import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export function Accordion({
  header,
  children,
  defaultOpen = false,
  className = '',
  leading,
}: {
  leading?: ReactNode;
  header: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={`rounded-xl2 border border-line bg-white shadow-card ${className}`}>
      <div className="flex items-center">
      {leading && <div className="shrink-0 pl-2">{leading}</div>}
      <button
        type="button"
        className={`flex min-h-[56px] w-full items-center gap-3 py-3 pr-4 text-left ${leading ? 'pl-1' : 'pl-4'}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="min-w-0 flex-1">{header}</div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      </div>
      {open && (
        <div id={id} className="animate-fadeUp border-t border-line px-4 pb-4 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
