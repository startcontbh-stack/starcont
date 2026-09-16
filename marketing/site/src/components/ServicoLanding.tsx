import Link from "next/link";
import {
  getServico,
  servicoPath,
  site,
  whatsappLink,
  type Servico,
} from "@/lib/site";
import { FormCard } from "./FormCard";
import { Faq } from "./Faq";
import { EquipeReel } from "./EquipeReel";
import { ArrowIcon, CheckIcon, WhatsAppIcon, iconMap } from "./Icons";
import { BreadcrumbJsonLd, FaqJsonLd, ServicoJsonLd } from "./JsonLd";
import { Reveal } from "./ui/reveal";

/**
 * Página de serviço no formato da landing page de conversão: formulário na
 * primeira dobra, benefícios, escopo, público, etapas, equipe, FAQ e CTA final.
 * O conteúdo de cada serviço vem de `servicos` em `@/lib/site`.
 */
export function ServicoLanding({ servico }: { servico: Servico }) {
  const Icon = iconMap[servico.icone];
  const origem = `servico-${servico.slug}`;
  const relacionados = servico.relacionados
    .map(getServico)
    .filter((s): s is Servico => !!s);

  return (
    <>
      <ServicoJsonLd servico={servico} />
      <FaqJsonLd perguntas={servico.faq} />
      <BreadcrumbJsonLd
        itens={[
          { nome: "Início", path: "/" },
          { nome: "Serviços", path: "/servicos" },
          { nome: servico.titulo, path: servicoPath(servico.slug) },
        ]}
      />

      {/* HERO + FORM */}
      <section className="relative overflow-hidden bg-gradient-to-br from-azul-escuro via-azul-escuro to-azul-profundo text-branco">
        <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-vermelho/15 blur-3xl" />
        <div className="arco-marca -bottom-96 -left-72 h-[32rem] w-[32rem]" />
        <div className="pontilhado bottom-6 right-6 h-24 w-40 opacity-50" />
        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-6 md:py-14">
          <nav aria-label="Você está em" className="text-xs text-cinza-claro/70">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-branco">
                  Início
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/servicos" className="hover:text-branco">
                  Serviços
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-cinza-claro" aria-current="page">
                {servico.titulo}
              </li>
            </ol>
          </nav>

          {/* Mobile: headline → formulário → descrição → destaques (form na 1ª dobra).
              Desktop (md): 2 colunas — texto à esquerda, form à direita. */}
          <div className="mt-6 flex flex-col gap-5 md:mt-10 md:grid md:grid-cols-2 md:items-center md:gap-x-12 md:gap-y-6">
            <div className="order-1 md:order-none md:col-start-1 md:row-start-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-vermelho/20 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-widest text-vermelho-claro md:px-4 md:py-1.5 md:text-xs">
                <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" /> {servico.titulo}
              </span>
              <h1 className="mt-3 font-display text-[1.7rem] font-bold leading-snug md:mt-5 md:text-[2.6rem] md:leading-tight">
                {servico.h1}{" "}
                <span className="text-vermelho-claro">{servico.h1Destaque}</span>
              </h1>
            </div>

            <div className="order-2 md:order-none md:col-start-2 md:row-start-1 md:row-span-3 md:self-center md:pl-6">
              <FormCard
                origem={origem}
                interessePadrao={servico.interesse}
                idPrefix="hero"
              />
            </div>

            <p className="order-3 max-w-lg text-sm leading-relaxed text-cinza-claro/90 md:order-none md:col-start-1 md:row-start-2 md:text-lg">
              {servico.intro}
            </p>

            <ul className="order-4 space-y-2 text-sm md:order-none md:col-start-1 md:row-start-3 md:space-y-2.5 md:text-base">
              {[
                `Atendimento para ${servico.publico.toLowerCase()}`,
                `Presencial na ${site.cidadeBase.regiao} e online em todo o Brasil`,
                "Contato direto pelo WhatsApp, sem burocracia",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-cinza-claro">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-vermelho/20 text-vermelho-claro">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Reveal className="grid gap-6 md:grid-cols-3">
          {servico.beneficios.map((b) => (
            <div key={b.titulo} className="rounded-2xl border border-cinza-claro bg-nevoa p-7">
              <span className="block h-1 w-10 rounded-full bg-vermelho" />
              <h2 className="mt-4 font-display text-lg font-semibold text-azul-escuro">
                {b.titulo}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-cinza-escuro">{b.texto}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* O QUE ESTÁ INCLUÍDO + PARA QUEM */}
      <section className="bg-nevoa py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
              O que está incluído
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-azul-escuro md:text-3xl">
              O que a Start Cont faz por você
            </h2>
            <ul className="mt-8 grid gap-3">
              {servico.inclui.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-suave"
                >
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-azul-escuro text-vermelho-claro">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <span className="text-cinza-escuro">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
              Para quem é
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-azul-escuro md:text-3xl">
              Indicado para
            </h2>
            <ul className="mt-8 grid gap-3">
              {servico.paraQuem.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-suave"
                >
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-vermelho/10 text-vermelho">
                    <ArrowIcon className="h-4 w-4" />
                  </span>
                  <span className="text-cinza-escuro">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
            Como funciona
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-azul-escuro md:text-3xl">
            Simples, do primeiro contato à rotina
          </h2>
        </Reveal>
        <Reveal delay={120} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {servico.etapas.map((e, i) => (
            <div key={e.titulo} className="rounded-3xl border border-cinza-claro bg-white p-6 shadow-suave">
              <span className="font-display text-3xl font-extrabold text-azul-escuro">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-1 block h-1 w-8 rounded-full bg-vermelho" />
              <h3 className="mt-4 font-display text-lg font-semibold text-azul-escuro">
                {e.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cinza-escuro">{e.texto}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* EQUIPE */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
            Equipe
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-azul-escuro md:text-3xl">
            Quem vai cuidar de você
          </h2>
        </div>
        <div className="mt-10 flex justify-center">
          <EquipeReel />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
            Dúvidas frequentes
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-azul-escuro md:text-3xl">
            Perguntas sobre {servico.titulo.toLowerCase()}
          </h2>
        </div>
        <div className="mt-10">
          <Faq perguntas={servico.faq} />
        </div>
      </section>

      {/* RELACIONADOS */}
      {relacionados.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-16">
          <h2 className="font-display text-xl font-bold text-azul-escuro">
            Serviços relacionados
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {relacionados.map((r) => {
              const RIcon = iconMap[r.icone];
              return (
                <Link
                  key={r.slug}
                  href={servicoPath(r.slug)}
                  className="group flex items-start gap-4 rounded-3xl border border-cinza-claro bg-white p-6 shadow-suave transition-all hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-azul-escuro text-vermelho-claro">
                    <RIcon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-azul-escuro group-hover:text-vermelho">
                      {r.titulo}
                    </span>
                    <span className="mt-1 block text-sm text-cinza-escuro">{r.resumo}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-gradient-to-br from-azul-escuro to-azul-profundo py-16 text-branco">
        <div className="arco-marca -right-48 -top-56 h-96 w-96" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-5 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">
              Vamos resolver isso <span className="text-vermelho-claro">juntos?</span>
            </h2>
            <p className="mt-4 text-cinza-claro/90">
              Simplificamos o burocrático e facilitamos o seu caminho. Preencha ao
              lado ou chame direto no WhatsApp.
            </p>
            <a
              href={whatsappLink(
                `Olá! Vim pela página de ${servico.titulo} e gostaria de falar com a Start Cont.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-vermelho px-6 py-3 font-semibold text-white transition-colors hover:bg-vermelho-escuro"
            >
              <WhatsAppIcon className="h-5 w-5" /> {site.telefoneExibicao}
            </a>
          </div>
          <FormCard
            titulo="Peça uma proposta"
            origem={origem}
            interessePadrao={servico.interesse}
            idPrefix="cta"
          />
        </div>
      </section>
    </>
  );
}
