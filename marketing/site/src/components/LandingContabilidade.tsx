import Link from "next/link";
import { faqGeral, servicoPath, servicos, site } from "@/lib/site";
import { FormCard } from "./FormCard";
import { Faq } from "./Faq";
import { EquipeReel } from "./EquipeReel";
import { Logo } from "./Logo";
import { CheckIcon, ChartIcon, iconMap } from "./Icons";
import { EmpresaJsonLd, FaqJsonLd } from "./JsonLd";

const beneficios = [
  {
    titulo: "Atendimento humanizado",
    texto:
      "Você fala direto com quem cuida da sua empresa. Estamos próximos, ouvimos e entendemos.",
  },
  {
    titulo: "Vamos até você",
    texto:
      "Visitas na Grande BH para conhecer seus processos — e atendimento online em todo o Brasil.",
  },
  {
    titulo: "WhatsApp, não e-mail",
    texto:
      "Comunicação ágil e direta pelo WhatsApp e telefone. Mais rápido, mais fácil, mais humano.",
  },
];

/**
 * Landing page de contabilidade em Belo Horizonte — sem menu, foco único em
 * conversão (formulário → CRM → WhatsApp). Feita para tráfego pago.
 */
export function LandingContabilidade() {
  return (
    <main className="flex-1 bg-white">
      <EmpresaJsonLd />
      <FaqJsonLd perguntas={faqGeral} />

      {/* HERO + FORM */}
      <section className="relative overflow-hidden bg-gradient-to-br from-azul-escuro via-azul-escuro to-azul-profundo text-branco">
        <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-vermelho/15 blur-3xl" />
        <div className="arco-marca -right-64 -top-72 h-[34rem] w-[34rem]" />
        <div className="arco-marca -bottom-96 -left-72 h-[32rem] w-[32rem]" />
        <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-5 md:py-10">
          <div className="flex justify-center md:justify-start">
            <Logo variant="light" taglineClassName="hidden md:block" />
          </div>

          {/* Mobile: headline → formulário → descrição → badges (form na 1ª dobra).
              Desktop (md): 2 colunas — texto à esquerda, form à direita. */}
          <div className="mt-6 flex flex-col gap-5 md:mt-14 md:grid md:grid-cols-2 md:items-center md:gap-x-12 md:gap-y-6">
            <div className="order-1 md:order-none md:col-start-1 md:row-start-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-vermelho/20 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-vermelho-claro md:px-4 md:py-1.5 md:text-xs">
                <ChartIcon className="h-3.5 w-3.5 md:h-4 md:w-4" /> Contabilidade em
                Belo Horizonte
              </span>
              <h1 className="mt-3 font-display text-[1.7rem] font-bold leading-snug md:mt-5 md:text-[2.7rem] md:leading-tight">
                Um contador de verdade, perto de você —{" "}
                <span className="text-vermelho-claro">sem burocracia.</span>
              </h1>
            </div>

            <div className="order-2 md:order-none md:col-start-2 md:row-start-1 md:row-span-3 md:self-center md:pl-6">
              <FormCard origem="lp-contabilidade-bh" idPrefix="hero" />
            </div>

            <p className="order-3 max-w-lg text-sm text-cinza-claro/90 md:order-none md:col-start-1 md:row-start-2 md:text-lg">
              Abertura de empresa, contabilidade mensal, planejamento tributário,
              departamento pessoal e Imposto de Renda.{" "}
              <strong className="text-branco">Presencial</strong> em toda a Grande
              BH ou <strong className="text-branco">online</strong>, onde você
              estiver.
            </p>

            <ul className="order-4 space-y-2 text-sm md:order-none md:col-start-1 md:row-start-3 md:space-y-2.5 md:text-base">
              {[
                "Pessoa física e jurídica",
                "Da simples regularização às grandes indústrias",
                "Preparação para a Reforma Tributária",
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
        <div className="grid gap-6 md:grid-cols-3">
          {beneficios.map((b) => (
            <div key={b.titulo} className="rounded-2xl border border-cinza-claro bg-nevoa p-7">
              <span className="block h-1 w-10 rounded-full bg-vermelho" />
              <h2 className="mt-4 font-display text-lg font-semibold text-azul-escuro">
                {b.titulo}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-cinza-escuro">{b.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="bg-nevoa py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center font-display text-2xl font-bold text-azul-escuro md:text-3xl">
            Como podemos ajudar
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {servicos.map((s) => {
              const Icon = iconMap[s.icone];
              return (
                <Link
                  key={s.slug}
                  href={servicoPath(s.slug)}
                  className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-suave transition hover:shadow-card"
                >
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-azul-escuro text-vermelho-claro">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-azul-escuro">{s.titulo}</span>
                    <span className="mt-0.5 block text-sm text-cinza-escuro">{s.resumo}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
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
      <section className="mx-auto max-w-4xl px-5 pb-16">
        <h2 className="text-center font-display text-2xl font-bold text-azul-escuro md:text-3xl">
          Perguntas frequentes
        </h2>
        <div className="mt-10">
          <Faq perguntas={faqGeral} />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-gradient-to-br from-azul-escuro to-azul-profundo py-16 text-branco">
        <div className="arco-marca -right-48 -top-56 h-96 w-96" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-5 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">
              Nova fase. Novos tempos.{" "}
              <span className="text-vermelho-claro">Mesmo compromisso.</span>
            </h2>
            <p className="mt-4 text-cinza-claro/90">
              Simplificamos o burocrático e facilitamos o caminho do empresário.
              Preencha ao lado e fale com a Start Cont agora pelo WhatsApp.
            </p>
            <p className="mt-6 text-sm text-cinza-claro/70">
              {site.cidadeBase.cidade}/{site.cidadeBase.estado} · atendimento em toda
              a {site.cidadeBase.regiao} e online no Brasil · {site.telefoneExibicao}
            </p>
          </div>
          <FormCard origem="lp-contabilidade-bh" idPrefix="cta" />
        </div>
      </section>

      <footer className="bg-azul-profundo py-6 text-center text-xs text-cinza-claro/60">
        © {new Date().getFullYear()} {site.nomeCompleto}
        {site.cnpj ? ` · CNPJ ${site.cnpj}` : ""}
      </footer>
    </main>
  );
}
