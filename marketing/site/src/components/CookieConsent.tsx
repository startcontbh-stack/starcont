"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const CHAVE = "startcont_consent";
const EVENTO_REABRIR = "startcont:abrir-cookies";

type Escolha = "granted" | "denied";

function lerEscolha(): Escolha | null {
  try {
    const v = window.localStorage.getItem(CHAVE);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Grava a escolha e avisa o Google (Modo de Consentimento v2). */
function aplicarEscolha(escolha: Escolha) {
  try {
    window.localStorage.setItem(CHAVE, escolha);
  } catch {
    // Sem armazenamento (aba anônima etc.): vale só nesta visita.
  }
  window.gtag?.("consent", "update", {
    ad_storage: escolha,
    ad_user_data: escolha,
    ad_personalization: escolha,
    analytics_storage: escolha,
  });
}

/**
 * Aviso de cookies (LGPD) com o Modo de Consentimento do Google: os cookies de
 * publicidade e medição ficam negados até o visitante aceitar. O estado padrão
 * "negado" é definido no <head> (layout.tsx), antes das tags do Google.
 */
export function CookieConsent() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    // Só no navegador: o localStorage não existe no servidor.
    const inicial = window.setTimeout(() => {
      if (lerEscolha() === null) setAberto(true);
    }, 0);
    const reabrir = () => setAberto(true);
    window.addEventListener(EVENTO_REABRIR, reabrir);
    return () => {
      window.clearTimeout(inicial);
      window.removeEventListener(EVENTO_REABRIR, reabrir);
    };
  }, []);

  // Portal e painel são áreas de cliente/equipe: não mostram o aviso.
  if (/^\/(portal|admin)(\/|$)/.test(pathname)) return null;
  if (!aberto) return null;

  function escolher(escolha: Escolha) {
    aplicarEscolha(escolha);
    setAberto(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-azul-profundo px-5 py-4 text-cinza-claro shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.5)]"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-relaxed">
          Usamos cookies para o funcionamento do site e, com a sua permissão,
          para medir o desempenho dos nossos anúncios. Você pode aceitar ou
          recusar. Saiba mais na nossa{" "}
          <Link
            href="/politica-de-privacidade"
            className="font-semibold text-branco underline underline-offset-2"
          >
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => escolher("denied")}
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-branco transition-colors hover:bg-white/10"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => escolher("granted")}
            className="rounded-full bg-vermelho px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-vermelho-escuro"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}

/** Botão do rodapé para o visitante rever a escolha. */
export function PreferenciasCookies({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(EVENTO_REABRIR))}
    >
      Preferências de cookies
    </button>
  );
}
