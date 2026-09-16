/**
 * Símbolo da Start Cont — play dentro de um anel, em vermelho com degradê
 * (redesenho vetorial do logo em identidade/referencias-startcont/logos).
 */
export function LogoMark({
  className = "h-11 w-11",
  idPrefix = "sc",
}: {
  className?: string;
  /** Prefixo dos ids dos degradês — mude se houver dois símbolos iguais na página. */
  idPrefix?: string;
}) {
  const ring = `${idPrefix}-ring`;
  const tri = `${idPrefix}-tri`;
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={ring} x1="0.15" y1="0.1" x2="0.95" y2="0.9">
          <stop offset="0" stopColor="#ff2b3a" />
          <stop offset="0.55" stopColor="#d0142c" />
          <stop offset="1" stopColor="#d0142c" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={tri} x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0" stopColor="#7d0c1a" />
          <stop offset="1" stopColor="#ff2b3a" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="none" stroke={`url(#${ring})`} strokeWidth="2.6" />
      <path
        d="M19.2 15.6 33.4 24l-14.2 8.4Z"
        fill={`url(#${tri})`}
        stroke="#e3162a"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  variant = "dark",
  showTagline = true,
  taglineClassName = "",
  size = "md",
}: {
  /** "dark" = texto azul-marinho (fundo claro) · "light" = texto branco (fundo escuro) */
  variant?: "dark" | "light";
  showTagline?: boolean;
  /** Classes extras pra tagline (ex.: "hidden md:block" pra sumir no mobile) */
  taglineClassName?: string;
  size?: "md" | "lg";
}) {
  const start = variant === "light" ? "text-branco" : "text-azul-escuro";
  const cont = variant === "light" ? "text-[#ff2b3a]" : "text-vermelho";
  const sub = variant === "light" ? "text-cinza-claro" : "text-azul-escuro/80";
  const divider = variant === "light" ? "bg-vermelho/70" : "bg-vermelho/60";
  const lg = size === "lg";

  return (
    <span className="flex items-center gap-2.5" aria-label="Start Cont — Assessoria Contábil">
      <LogoMark
        idPrefix={`sc-${variant}-${size}`}
        className={lg ? "h-14 w-14" : "h-10 w-10 md:h-11 md:w-11"}
      />
      <span className={`w-px self-stretch ${divider}`} aria-hidden="true" />
      <span className="leading-none" aria-hidden="true">
        <span
          className={`block whitespace-nowrap font-marca font-bold tracking-tight ${
            lg ? "text-3xl" : "text-[1.35rem] md:text-2xl"
          }`}
        >
          <span className={start}>Start</span> <span className={cont}>Cont</span>
        </span>
        {showTagline && (
          <span
            className={`mt-1 block whitespace-nowrap font-display font-medium uppercase ${
              lg ? "text-[0.7rem] tracking-[0.34em]" : "text-[0.52rem] tracking-[0.3em] md:text-[0.58rem]"
            } ${sub} ${taglineClassName}`}
          >
            Assessoria Contábil
          </span>
        )}
      </span>
    </span>
  );
}
