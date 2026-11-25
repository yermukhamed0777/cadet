/** CADET wordmark — original brand mark, not an official insignia */
export function LogoMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="12" fill="#0B2545" />
      <path d="M14 40 L32 28 L50 40" fill="none" stroke="#D9A441" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 50 L32 38 L50 50" fill="none" stroke="#D9A441" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity=".55" />
      <rect x="26" y="10" width="12" height="12" rx="2" fill="#fff" transform="rotate(45 32 16)" />
    </svg>
  );
}

export function Wordmark({ size = 'lg', tagline = true }: { size?: 'lg' | 'sm'; tagline?: boolean }) {
  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2.5">
        <LogoMark className="h-8 w-8" />
        <div className="font-display text-[15px] font-semibold uppercase leading-none tracking-[0.12em] text-white">
          <span className="text-gold">Cadet</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-start gap-4">
      <LogoMark className="h-12 w-12" />
      <div>
        <h1 className="font-display text-[40px] font-semibold uppercase leading-[0.95] tracking-[0.06em] text-white">
          <span className="text-gold">Cadet</span>
        </h1>
        {tagline && (
          <p className="mt-3 flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em] text-white/70">
            <span className="h-px w-6 bg-gold" aria-hidden />
            Your path to commission
          </p>
        )}
      </div>
    </div>
  );
}
