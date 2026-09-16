import type { Metadata } from "next";
import Link from "next/link";
import { mensagemPadrao, servicoPath, servicos, whatsappLink } from "@/lib/site";
import { ArrowIcon, WhatsAppIcon, iconMap } from "@/components/Icons";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { GlowCard } from "@/components/ui/spotlight-card";

export const metadata: Metadata = {
  title: "Serviços de Contabilidade em Belo Horizonte",
  description:
    "Abertura de empresa, contabilidade mensal, planejamento tributário, departamento pessoal, regularização fiscal e Imposto de Renda. Conheça os serviços da Start Cont.",
  alternates: { canonical: "/servicos" },
  openGraph: {
    title: "Serviços de Contabilidade | Start Cont",
    url: "/servicos",
  },
};

export default function ServicosPage() {
  return (
    <>
      <BreadcrumbJsonLd
        itens={[
          { nome: "Início", path: "/" },
          { nome: "Serviços", path: "/servicos" },
        ]}
      />
      <section className="relative overflow-hidden bg-gradient-to-b from-azul-escuro via-azul-escuro to-azul-profundo py-16 text-branco md:py-20">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-vermelho/20 blur-3xl" />
        <div className="arco-marca -left-72 -top-80 h-[32rem] w-[32rem]" />
        <div className="relative mx-auto max-w-6xl px-5">
          <header className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-vermelho-claro">
              Serviços
            </span>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight">
              Serviços de contabilidade para pessoas e empresas
            </h1>
            <p className="mt-4 text-cinza-claro/90">
              Da abertura do CNPJ ao acompanhamento mensal de grandes empresas e
              indústrias — com atendimento próximo na Grande BH e online em todo o
              Brasil.
            </p>
          </header>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicos.map((s) => {
              const Icon = iconMap[s.icone];
              return (
                <Link key={s.slug} href={servicoPath(s.slug)} className="group block">
                  <GlowCard
                    customSize
                    glowColor={s.destaque ? "red" : "blue"}
                    className="h-full w-full !rounded-3xl transition-transform group-hover:-translate-y-1"
                  >
                    <div className="relative z-10 flex h-full flex-col p-4">
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-vermelho-claro">
                        <Icon className="h-7 w-7" />
                      </span>
                      <h2 className="mt-5 font-display text-xl font-semibold text-branco">
                        {s.titulo}
                      </h2>
                      <p className="mt-1 text-xs uppercase tracking-widest text-cinza-claro/60">
                        {s.publico}
                      </p>
                      <p className="mt-3 leading-relaxed text-cinza-claro/85">{s.resumo}</p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-vermelho-claro">
                        Saiba mais
                        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </GlowCard>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-azul-escuro md:text-3xl">
          Não encontrou o que precisa?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-cinza-escuro">
          Conte o seu caso no WhatsApp. Simplificamos o burocrático e mostramos o
          caminho mais fácil.
        </p>
        <a
          href={whatsappLink(mensagemPadrao)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-vermelho px-7 py-3.5 font-semibold text-white shadow-card transition-transform hover:scale-[1.02]"
        >
          <WhatsAppIcon className="h-5 w-5" /> Falar com a Start Cont
        </a>
      </section>
    </>
  );
}
