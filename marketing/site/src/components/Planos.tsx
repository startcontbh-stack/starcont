import {
  mensagemPlano,
  planos,
  publicosAtendidos,
  regimesAtendidos,
  site,
  whatsappLink,
  type Plano,
} from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import {
  ChartIcon,
  CheckIcon,
  MapPinIcon,
  planoIconMap,
  WhatsAppIcon,
} from "@/components/Icons";

/**
 * Tabela de planos da home. Cada card leva direto pro WhatsApp com a
 * mensagem já escrita citando o plano — o cliente não precisa explicar
 * de novo qual viu no site.
 */
export function Planos() {
  return (
    <section
      id="planos"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-azul-profundo via-azul-escuro to-azul-profundo pb-16 pt-8 text-branco md:pb-20 md:pt-12"
    >
      <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-vermelho/10 blur-3xl" />
      <div className="arco-marca -left-72 -top-40 h-[34rem] w-[34rem] opacity-60" />
      <div className="pontilhado right-6 top-10 h-28 w-40 opacity-50" />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-vermelho-claro">
            Planos
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold text-branco md:text-3xl">
            Contabilidade estratégica para empresas que querem{" "}
            <span className="text-vermelho-claro">crescer.</span>
          </h2>
          <p className="mt-3 text-sm text-cinza-claro/85 md:text-base">
            Mais que números, resultados reais. Escolha o plano do seu perfil e
            fale com a gente no WhatsApp — o valor final depende do volume de
            notas, do regime tributário e do número de funcionários.
          </p>
        </Reveal>

        {/* Celular: os cards empilham e cada um é alto, então os quatro valores
            ficam num atalho logo no topo — a pessoa vê tudo sem rolar. */}
        <ul className="mt-6 grid grid-cols-2 gap-3 md:hidden">
          {planos.map((plano) => (
            <li key={plano.slug}>
              <a
                href={`#plano-${plano.slug}`}
                className="block rounded-2xl bg-white/10 px-4 py-3 transition-colors hover:bg-white/15"
              >
                <span className="block text-xs font-semibold uppercase leading-tight tracking-wider text-cinza-claro/80">
                  {plano.nome}
                </span>
                <span className="mt-1 block font-display text-lg font-bold text-branco">
                  <span className="text-xs font-medium text-cinza-claro/70">
                    a partir de{" "}
                  </span>
                  R$ {plano.precoMensal}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 xl:grid-cols-4">
          {planos.map((plano) => (
            <CardPlano key={plano.slug} plano={plano} />
          ))}
        </div>

        {/* Faixa de públicos e regimes atendidos */}
        <Reveal className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-5 text-sm text-cinza-claro/80 lg:flex-row lg:items-center lg:gap-8">
            <p className="flex shrink-0 items-center gap-2 font-medium text-branco">
              <MapPinIcon className="h-5 w-5 text-vermelho-claro" />
              {site.cidadeBase.cidade} e região
            </p>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {publicosAtendidos.map((p) => (
                <li
                  key={p}
                  className="border-l border-vermelho/50 pl-3 uppercase tracking-wider"
                >
                  {p}
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 lg:ml-auto">
              {regimesAtendidos.map((r) => (
                <li
                  key={r}
                  className="border-l border-vermelho/50 pl-3 uppercase tracking-wider"
                >
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CardPlano({ plano }: { plano: Plano }) {
  const Icone = planoIconMap[plano.icone];

  return (
    <Reveal className="h-full">
      <article
        id={`plano-${plano.slug}`}
        className={`scroll-mt-28 flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 transition-transform hover:-translate-y-1 ${
          plano.destaque ? "ring-2 ring-vermelho" : "ring-white/10"
        }`}
      >
        {/* Cabeçalho escuro com o ícone, como no material da marca.
            A altura mínima a partir de md alinha a faixa escura dos quatro
            cards, que senão quebra em alturas diferentes conforme o tamanho
            do nome e da promessa de cada plano. */}
        <div className="relative overflow-hidden bg-gradient-to-br from-azul-escuro to-azul-profundo px-6 pb-5 pt-6 md:min-h-[13.5rem]">
          <div className="arco-marca -right-16 -top-20 h-48 w-48 opacity-70" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-vermelho text-vermelho-claro">
              <Icone className="h-5 w-5" />
            </span>
            <h3 className="min-w-0 font-display text-xl font-bold leading-tight text-branco">
              {plano.nome}
            </h3>
          </div>
          <p className="relative mt-3 text-sm uppercase leading-relaxed tracking-wide text-cinza-claro/80">
            {plano.promessa}
          </p>
        </div>

        {/* Corpo claro: preço, o que inclui e o fecho */}
        <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
          <span className="block h-0.5 w-10 bg-vermelho" />
          <p className="mt-4 text-sm text-cinza-escuro">A partir de</p>
          <p className="font-display font-bold leading-none text-tinta">
            <span className="align-top text-lg">R$ </span>
            <span className="text-5xl">{plano.precoMensal}</span>
          </p>
          <p className="mt-1 text-sm text-cinza-escuro">por mês</p>

          {/* mb-6 garante o respiro mínimo quando não sobra espaço livre */}
          <ul className="mb-6 mt-6 space-y-3">
            {plano.itens.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-vermelho text-white">
                  <CheckIcon className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-sm leading-snug text-cinza-escuro">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* mt-auto: os cards têm a mesma altura, então a nota e o botão
              descem pro rodapé e os quatro CTAs ficam na mesma linha. */}
          <div className="mt-auto flex items-start gap-3 rounded-2xl bg-nevoa p-4">
            <ChartIcon className="mt-0.5 h-6 w-6 shrink-0 text-azul-escuro" />
            <p className="text-sm leading-snug text-cinza-escuro">{plano.nota}</p>
          </div>

          <a
            href={whatsappLink(mensagemPlano(plano))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-vermelho px-5 py-3.5 font-semibold text-white transition-colors hover:bg-vermelho-escuro"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Quero esse plano
          </a>
          <p className="mt-2 text-center text-xs text-cinza">
            Abre o WhatsApp da Start Cont
          </p>
        </div>
      </article>
    </Reveal>
  );
}
