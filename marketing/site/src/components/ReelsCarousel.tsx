"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { reelUrl, type Reel } from "@/lib/site";
import { ReelEmbed } from "./ReelEmbed";
import { ArrowIcon, InstagramIcon } from "./Icons";

/**
 * Carrossel dos reels do Instagram.
 *
 * A rolagem é nativa com scroll-snap: no celular o dedo arrasta como o usuário
 * espera, sem biblioteca de gestos, e no desktop as setas rolam de um card por
 * vez. Cada card monta o player só quando chega perto da tela (ver ReelEmbed).
 */
export function ReelsCarousel({ reels }: { reels: Reel[] }) {
  const trilhaRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false);

  const atualizar = useCallback(() => {
    const el = trilhaRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const centro = el.scrollLeft + el.clientWidth / 2;
    let maisProximo = 0;
    let menorDistancia = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(card.offsetLeft + card.clientWidth / 2 - centro);
      if (d < menorDistancia) {
        menorDistancia = d;
        maisProximo = i;
      }
    });
    setAtivo(maisProximo);
    setPodeVoltar(el.scrollLeft > 8);
    setPodeAvancar(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    atualizar();
    const el = trilhaRef.current;
    if (!el) return;
    el.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    return () => {
      el.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
    };
  }, [atualizar]);

  function irPara(indice: number) {
    const el = trilhaRef.current;
    if (!el) return;
    const card = el.children[indice] as HTMLElement | undefined;
    if (!card) return;
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2,
      behavior: "smooth",
    });
  }

  if (reels.length === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Reels do Instagram da Start Cont"
    >
      <div
        ref={trilhaRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reels.map((reel, i) => (
          <article
            key={reel.shortcode}
            className="w-[76vw] max-w-[320px] shrink-0 snap-center sm:w-[320px]"
            aria-label={`${i + 1} de ${reels.length}: ${reel.titulo}`}
          >
            <ReelEmbed reel={reel} />
            <div className="mt-4">
              {reel.tag && (
                <span className="inline-block rounded-full bg-vermelho/10 px-3 py-1 text-xs font-semibold text-vermelho">
                  {reel.tag}
                </span>
              )}
              <h3 className="mt-2 font-display text-base font-semibold text-azul-escuro">
                {reel.titulo}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cinza-escuro">
                {reel.descricao}
              </p>
              <a
                href={reelUrl(reel.shortcode)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-vermelho hover:underline"
              >
                <InstagramIcon className="h-4 w-4" /> Ver no Instagram
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => irPara(ativo - 1)}
          disabled={!podeVoltar}
          aria-label="Reel anterior"
          className="grid h-10 w-10 place-items-center rounded-full border border-cinza-claro bg-white text-azul-escuro transition hover:enabled:border-vermelho hover:enabled:text-vermelho disabled:opacity-35"
        >
          <ArrowIcon className="h-4 w-4 rotate-180" />
        </button>

        <div className="flex items-center gap-2">
          {reels.map((reel, i) => (
            <button
              key={reel.shortcode}
              type="button"
              onClick={() => irPara(i)}
              aria-label={`Ir para o reel ${i + 1}`}
              aria-current={i === ativo}
              className={`h-2 rounded-full transition-all ${
                i === ativo ? "w-6 bg-vermelho" : "w-2 bg-cinza-claro hover:bg-cinza"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => irPara(ativo + 1)}
          disabled={!podeAvancar}
          aria-label="Próximo reel"
          className="grid h-10 w-10 place-items-center rounded-full border border-cinza-claro bg-white text-azul-escuro transition hover:enabled:border-vermelho hover:enabled:text-vermelho disabled:opacity-35"
        >
          <ArrowIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
