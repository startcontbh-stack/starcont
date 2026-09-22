import Link from "next/link";
import { precoReais, servicoPath, type Servico } from "@/lib/site";
import { ArrowIcon, iconMap } from "./Icons";
import { GlowCard } from "./ui/spotlight-card";

/**
 * Card de serviço da home e de /servicos.
 *
 * Serviço com preço fixo (o certificado digital) ganha as etiquetas de valor
 * e ocupa a linha inteira da grade: com sete serviços em três colunas, o
 * último card ficaria sozinho e torto numa linha só dele.
 */
export function ServicoCard({
  servico,
  titulo: Titulo = "h3",
  mostrarPublico = false,
}: {
  servico: Servico;
  /** Nível do título — h2 em /servicos, h3 na home (que já tem o h2 da seção). */
  titulo?: "h2" | "h3";
  mostrarPublico?: boolean;
}) {
  const Icon = iconMap[servico.icone];
  const comPreco = Boolean(servico.precos?.length);

  return (
    <Link
      href={servicoPath(servico.slug)}
      className={`group block ${comPreco ? "md:col-span-2 lg:col-span-3" : ""}`}
    >
      <GlowCard
        customSize
        glowColor={servico.destaque || comPreco ? "red" : "blue"}
        className="h-full w-full !rounded-3xl transition-transform group-hover:-translate-y-1"
      >
        <div
          className={`relative z-10 flex h-full flex-col p-4 ${
            comPreco ? "lg:flex-row lg:items-center lg:gap-10" : ""
          }`}
        >
          {servico.destaque && (
            <span className="absolute right-2 top-2 rounded-full bg-vermelho/20 px-3 py-1 text-xs font-semibold text-vermelho-claro">
              Mais procurado
            </span>
          )}

          <div className="lg:flex-1">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-vermelho-claro">
              <Icon className="h-7 w-7" />
            </span>
            <Titulo className="mt-5 font-display text-xl font-semibold text-branco">
              {servico.titulo}
            </Titulo>
            {mostrarPublico && (
              <p className="mt-1 text-xs uppercase tracking-widest text-cinza-claro/60">
                {servico.publico}
              </p>
            )}
            <p className="mt-3 leading-relaxed text-cinza-claro/85">
              {servico.resumo}
            </p>
          </div>

          {comPreco && (
            <ul className="mt-5 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
              {servico.precos!.map((p) => (
                <li
                  key={p.rotulo}
                  className="rounded-2xl bg-white/10 px-5 py-3 text-center"
                >
                  <span className="block text-xs font-semibold uppercase tracking-widest text-vermelho-claro">
                    {p.rotulo}
                  </span>
                  <span className="block font-display text-2xl font-bold text-branco">
                    {precoReais(p.valor)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <span
            className={`mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-vermelho-claro ${
              comPreco ? "lg:mt-0 lg:shrink-0 lg:pt-0" : ""
            }`}
          >
            Saiba mais
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </GlowCard>
    </Link>
  );
}
