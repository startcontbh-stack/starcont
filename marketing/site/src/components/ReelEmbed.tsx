"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { reelEmbedUrl, reelUrl, type Reel } from "@/lib/site";
import { InstagramIcon, PlayIcon } from "./Icons";

/**
 * Embed oficial de um reel do Instagram — o iframe de .../embed/, sem o
 * embed.js (o script é pesado e obriga a reprocessar o DOM a cada render).
 *
 * Dois detalhes resolvem os problemas clássicos desse embed:
 *
 * 1. Altura. O iframe do Instagram não se ajusta sozinho, mas a página do
 *    embed publica um postMessage `{"type":"MEASURE","details":{"height":N}}`
 *    com a altura real do conteúdo — é isso que o embed.js escuta. Fazemos o
 *    mesmo. Até a mensagem chegar (ou se ela nunca chegar), usamos uma
 *    estimativa a partir da largura: vídeo 9:16 + o cabeçalho e o rodapé do
 *    embed. Assim o card nunca aparece cortado nem com faixa branca.
 *
 * 2. Peso. Cada embed carrega um player do Instagram inteiro. O iframe só é
 *    montado quando o card chega perto da tela — num carrossel de 6 reels,
 *    isso é a diferença entre 1 player e 6 carregando de uma vez.
 */

/** Cabeçalho (avatar + @perfil) e rodapé (ações + link) do embed, em px. */
const CHROME_PX = 118;
/** Enquanto o Instagram não responde, estimamos pelo vídeo vertical 9:16. */
const PROPORCAO_VIDEO = 16 / 9;

export function ReelEmbed({
  reel,
  /** Monta o iframe imediatamente, sem esperar entrar na tela (use no destaque). */
  eager = false,
  className = "",
}: {
  reel: Reel;
  eager?: boolean;
  className?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [visivel, setVisivel] = useState(eager);
  const [altura, setAltura] = useState<number | null>(null);
  const [alturaEstimada, setAlturaEstimada] = useState(600);

  /**
   * Os dois observadores nascem no ref callback, não num efeito: assim a
   * primeira medida acontece no commit em que o nó existe, sem o render
   * extra que um setState no corpo do efeito provocaria.
   */
  const observarContainer = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;
      const limpezas: Array<() => void> = [];

      const medir = () => {
        const largura = el.clientWidth;
        if (largura > 0) {
          setAlturaEstimada(Math.round(largura * PROPORCAO_VIDEO) + CHROME_PX);
        }
      };
      medir();

      if (typeof ResizeObserver !== "undefined") {
        const ro = new ResizeObserver(medir);
        ro.observe(el);
        limpezas.push(() => ro.disconnect());
      }

      // Monta o iframe quando o card se aproxima da tela.
      if (!eager) {
        if (typeof IntersectionObserver === "undefined") {
          setVisivel(true);
        } else {
          const io = new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting)) {
                setVisivel(true);
                io.disconnect();
              }
            },
            { rootMargin: "300px" }
          );
          io.observe(el);
          limpezas.push(() => io.disconnect());
        }
      }

      return () => limpezas.forEach((limpar) => limpar());
    },
    [eager]
  );

  // Altura real, informada pelo próprio Instagram.
  useEffect(() => {
    if (!visivel) return;
    function onMessage(e: MessageEvent) {
      if (!e.origin.endsWith("instagram.com")) return;
      if (e.source !== iframeRef.current?.contentWindow) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        const h = Number(data?.details?.height);
        if (data?.type === "MEASURE" && h > 0) setAltura(Math.round(h));
      } catch {
        // mensagem que não é do embed — ignora
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [visivel]);

  return (
    <div
      ref={observarContainer}
      className={`overflow-hidden rounded-2xl border border-white/10 bg-azul-profundo shadow-card ${className}`}
      style={{ height: altura ?? alturaEstimada }}
    >
      {visivel ? (
        <iframe
          ref={iframeRef}
          src={reelEmbedUrl(reel.shortcode)}
          title={reel.titulo}
          loading={eager ? "eager" : "lazy"}
          scrolling="no"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="block h-full w-full border-0 bg-white"
        />
      ) : (
        // Placeholder na identidade da marca enquanto o player não é montado.
        <a
          href={reelUrl(reel.shortcode)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-azul-escuro to-azul-profundo text-cinza-claro/70"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10">
            <PlayIcon className="h-6 w-6 translate-x-0.5 text-vermelho-claro" />
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium">
            <InstagramIcon className="h-4 w-4" /> Carregando o reel…
          </span>
        </a>
      )}
    </div>
  );
}
