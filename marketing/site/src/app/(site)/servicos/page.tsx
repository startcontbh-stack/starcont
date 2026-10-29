import type { Metadata } from "next";
import { mensagemPadrao, servicos, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/Icons";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { ServicoCard } from "@/components/ServicoCard";

export const metadata: Metadata = {
  title: "Serviços de Contabilidade em Belo Horizonte",
  description:
    "Abertura de empresa, contabilidade mensal, planejamento tributário, departamento pessoal, regularização fiscal, Imposto de Renda e certificado digital. Conheça os serviços da Start Cont.",
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
              Da abertura da empresa ao acompanhamento mensal de grandes empresas e
              indústrias — com atendimento próximo na Grande BH e online em todo o
              Brasil.
            </p>
          </header>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicos.map((s) => (
              <ServicoCard key={s.slug} servico={s} titulo="h2" mostrarPublico />
            ))}
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
