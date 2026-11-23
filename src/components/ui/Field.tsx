import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  hint?: ReactNode;
  id: string;
}

export const Field = forwardRef<HTMLInputElement, Props>(function Field({ label, error, hint, id, className = '', ...rest }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={`min-h-[48px] w-full rounded-xl border bg-white px-3.5 text-[16px] text-ink outline-none transition placeholder:text-muted/70 focus:border-navy focus:ring-2 focus:ring-gold/40 ${
          error ? 'border-red-400' : 'border-line'
        } ${className}`}
        {...rest}
      />
      {error ? (
        <p id={`${id}-err`} className="text-[13px] font-medium text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export function TextArea({
  label,
  error,
  id,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string | null; id: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        className={`min-h-[120px] w-full rounded-xl border bg-white px-3.5 py-3 text-[16px] text-ink outline-none focus:border-navy focus:ring-2 focus:ring-gold/40 ${
          error ? 'border-red-400' : 'border-line'
        }`}
        {...rest}
      />
      {error && <p className="text-[13px] font-medium text-red-700">{error}</p>}
    </div>
  );
}
