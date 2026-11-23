import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'gold' | 'secondary' | 'ghost' | 'danger';

const styles: Record<Variant, string> = {
  primary: 'bg-navy text-white hover:bg-navy-dark',
  gold: 'bg-gold text-navy hover:bg-gold-dark hover:text-white',
  secondary: 'bg-white text-navy border border-line hover:border-navy/30',
  ghost: 'bg-transparent text-navy hover:bg-navy/5',
  danger: 'bg-white text-red-700 border border-red-200 hover:bg-red-50',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  full?: boolean;
  icon?: ReactNode;
  size?: 'md' | 'sm';
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', loading, full, icon, size = 'md', className = '', children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex select-none items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${
        size === 'md' ? 'min-h-[48px] px-5 text-[15px]' : 'min-h-[40px] px-3.5 text-sm'
      } ${full ? 'w-full' : ''} ${styles[variant]} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      <span>{children}</span>
    </button>
  );
});
