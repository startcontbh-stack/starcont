import type { Metadata } from "next";
import Link from "next/link";
import {
  diferenciais,
  faqGeral,
  mensagemPadrao,
  prazoSimplesAberto,
  reelDestaque,
  reelsCarrossel,
  servicoPath,
  servicos,
  site,
  whatsappLink,
} from "@/lib/site";
import { getPublishedPosts } from "@/lib/posts";
import { iconMap } from "@/components/Icons";
import { Typewriter } from "@/components/ui/typewriter-text";
import { Reveal } from "@/components/ui/reveal";
import { EquipeReel } from "@/components/EquipeReel";
import { Planos } from "@/components/Planos";
import { ServicoCard } from "@/components/ServicoCard";
import { ReelEmbed } from "@/components/ReelEmbed";
import { ReelsCarousel } from "@/components/ReelsCarousel";
import { PostCard } from "@/components/PostCard";
import { Faq } from "@/components/Faq";
import { FaqJsonLd } from "@/components/JsonLd";
import {
  AlertIcon,
  ArrowIcon,
  CheckIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/Icons";

// ISR: HTML estático servido do cache (TTFB baixo, bom pro SEO), revalidado a
// cada hora. Posts novos do blog aparecem na home em até 60min (ou no próximo deploy).
export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "Contabilidade em Belo Horizonte | Start Cont Assessoria",
  },
  description:
    "Escritório de contabilidade em Belo Horizonte com atendimento humanizado para PF e PJ: abertura de empresa, contabilidade mensal, IR e Reforma Tributária.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Start Cont — Contabilidade em Belo Horizonte",
    description:
      "Simplificamos o burocrático e facilitamos o caminho do empresário. Atendimento na Grande BH e online em todo o Brasil.",
    url: "/",
  },
};

const destaquesHero = [
  "Atendimento para pessoa física e jurídica",
  "Vamos até a sua empresa na Grande BH",
  "Comunicação direta pelo WhatsApp",
  "Atendimento online em todo o Brasil",
];

export default async function HomePage() {
  const posts = await getPublishedPosts(3);
  const prazoAberto = prazoSimplesAberto();
  const outrosReels = reelsCarrossel();

  return (
    <>
      <FaqJsonLd perguntas={faqGeral} />

      {/* PLANOS — primeiro de tudo: o cliente pediu que os valores apareçam
          de cara, porque o preço de entrada baixo é o que puxa o contato. */}
      <Planos />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-azul-escuro via-azul-escuro to-azul-profundo text-branco">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-vermelho/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-azul/60 blur-3xl" />
        <div className="arco-marca -right-52 -top-72 h-[34rem] w-[34rem]" />
        <div className="arco-marca -bottom-80 -left-64 h-[30rem] w-[30rem]" />
        <div className="pontilhado left-4 top-10 h-28 w-40 opacity-60" />

        {/* Grid explícito: no desktop o reel ocupa a coluna 2 inteira; no
            celular ele sobe pra logo depois do título (ordem do DOM), pra não
            ficar enterrado embaixo dos botões e da lista. */}
        {/* As duas linhas dividem a altura do reel e o texto encosta na
            fronteira entre elas (self-end + self-start), o que deixa o bloco
            da esquerda centrado na vertical sem abrir buraco no meio. */}
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-2 md:grid-rows-[1fr_1fr] md:items-center md:gap-x-12 md:gap-y-8 md:py-24">
          <div className="animate-fade-up md:col-start-1 md:row-start-1 md:self-end">
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.3em] text-vermelho-claro md:text-sm">
                Contabilidade em Belo Horizonte
              </span>
              Simplificamos o burocrático para você{" "}
              <Typewriter
                text={["crescer.", "empreender.", "vender mais.", "decidir melhor."]}
                speed={110}
                deleteSpeed={55}
                delay={1800}
                loop
                className="text-vermelho-claro"
              />
            </h1>
          </div>

          {/* REEL EM DESTAQUE */}
          <div className="animate-fade-up md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
            <div className="mx-auto w-full max-w-[350px]">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-vermelho/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-vermelho-claro">
                <InstagramIcon className="h-3.5 w-3.5" /> Em destaque
              </span>
              <ReelEmbed reel={reelDestaque} />
              <h2 className="mt-4 font-display text-lg font-semibold text-branco">
                {reelDestaque.titulo}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-cinza-claro/85">
                {reelDestaque.descricao}
              </p>
            </div>
          </div>

          <div className="animate-fade-up md:col-start-1 md:row-start-2 md:self-start">
            <div className="flex flex-wrap gap-4">
              <a
                href={whatsappLink(mensagemPadrao)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-vermelho px-7 py-3.5 font-semibold text-white shadow-card transition-transform hover:scale-[1.02]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Falar com um contador
              </a>
              <Link
                href="#servicos"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-semibold text-branco transition-colors hover:bg-white/10"
              >
                Nossos serviços
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-cinza-claro/90 sm:grid-cols-2">
              {destaquesHero.map((d) => (
                <li key={d} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 shrink-0 text-vermelho-claro" /> {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* AVISO DA REFORMA — o card do hero deu lugar ao reel, mas o prazo é
          curto demais pra ficar só na seção lá embaixo. */}
      {prazoAberto && (
        <section className="border-b border-vermelho-escuro/30 bg-vermelho-escuro text-branco">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2.5 text-sm sm:items-center">
              <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 sm:mt-0" />
              <span>
                <strong className="font-semibold">Reforma Tributária:</strong>{" "}
                empresas do Simples optam pelo regime de IBS e CBS do 1º semestre
                de 2027 até <strong>30 de setembro de 2026</strong>.
              </span>
            </p>
            <Link
              href={servicoPath("planejamento-tributario")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-vermelho-escuro transition-transform hover:scale-[1.02]"
            >
              Simular minha empresa <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* REELS DO INSTAGRAM */}
      {outrosReels.length > 0 && (
        <section className="bg-nevoa py-16">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl px-5">
              <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
                Instagram
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-azul-escuro">
                Contabilidade explicada em um minuto
              </h2>
              <p className="mt-3 text-cinza-escuro">
                Os últimos vídeos do{" "}
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-vermelho hover:underline"
                >
                  {site.instagramHandle}
                </a>
                . Arraste para o lado para ver todos.
              </p>
            </Reveal>
            <Reveal delay={120} className="mt-10">
              <ReelsCarousel reels={outrosReels} />
            </Reveal>
          </div>
        </section>
      )}

      {/* EQUIPE */}
      <section id="equipe" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <Reveal className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
            Equipe
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-azul-escuro">
            Quem cuida da sua empresa
          </h2>
          <p className="mt-3 text-cinza-escuro">
            Atendimento personalizado: vamos até os nossos clientes e resolvemos
            muita coisa online também.
          </p>
        </Reveal>
        <Reveal delay={120} className="mt-12 flex justify-center">
          <EquipeReel />
        </Reveal>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
              Sobre a Start Cont
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-azul-escuro">
              Mais do que contabilidade: entendemos o seu negócio
            </h2>
            <p className="mt-5 leading-relaxed text-cinza-escuro">
              A Start Cont é uma assessoria contábil de Belo Horizonte que existe
              para simplificar o burocrático e facilitar o caminho do empresário.
              Nosso trabalho não se resume ao fisco: fazemos uma contabilidade
              humanizada, próxima de quem toca o negócio no dia a dia.
            </p>
            <p className="mt-4 leading-relaxed text-cinza-escuro">
              Atendemos pessoas físicas e jurídicas — desde uma simples
              regularização até o acompanhamento mensal de grandes empresas e
              indústrias. O atendimento é preferencial em toda a Grande BH, com
              visitas aos clientes, e online para todo o Brasil.
            </p>
            <p className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.2em] text-azul-escuro">
              Nova fase. Novos tempos.{" "}
              <span className="text-vermelho">Mesmo compromisso.</span>
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-nevoa p-6">
              <h3 className="font-display font-semibold text-azul-escuro">Missão</h3>
              <p className="mt-2 text-sm leading-relaxed text-cinza-escuro">
                {site.missao}
              </p>
            </div>
            <div className="rounded-2xl bg-nevoa p-6">
              <h3 className="font-display font-semibold text-azul-escuro">Visão</h3>
              <p className="mt-2 text-sm leading-relaxed text-cinza-escuro">
                {site.visao}
              </p>
            </div>
            <div className="rounded-2xl bg-nevoa p-6 sm:col-span-2">
              <h3 className="font-display font-semibold text-azul-escuro">Valores</h3>
              <ul className="mt-3 grid gap-3 text-sm text-cinza-escuro sm:grid-cols-2">
                {site.valores.map((v) => (
                  <li key={v.nome} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-vermelho" />
                    <span>
                      <strong className="font-semibold text-azul-escuro">{v.nome}:</strong>{" "}
                      {v.texto}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section
        id="servicos"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-azul-profundo via-azul-escuro to-azul-profundo py-20 text-branco"
      >
        <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-vermelho/10 blur-3xl" />
        <div className="arco-marca -right-72 top-10 h-[36rem] w-[36rem] opacity-60" />
        <div className="relative mx-auto max-w-6xl px-5">
          <Reveal className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-vermelho-claro">
              Serviços
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-branco">
              Contabilidade para pessoas e empresas, do começo ao crescimento
            </h2>
          </Reveal>
          <Reveal delay={120} className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicos.map((s) => (
              <ServicoCard key={s.slug} servico={s} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
            Por que a Start Cont
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-azul-escuro">
            Conhecemos o seu negócio para cuidar do que realmente importa
          </h2>
        </Reveal>
        <Reveal delay={120} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {diferenciais.map((d) => {
            const Icon = iconMap[d.icone];
            return (
              <div
                key={d.titulo}
                className="rounded-3xl border border-cinza-claro bg-white p-6 shadow-suave"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-azul-escuro text-vermelho-claro">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-azul-escuro">
                  {d.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cinza-escuro">
                  {d.texto}
                </p>
              </div>
            );
          })}
        </Reveal>
      </section>

      {/* REFORMA TRIBUTÁRIA */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vermelho-escuro to-vermelho p-8 text-branco md:p-12">
          <div className="pontilhado -right-4 top-4 h-32 w-48 opacity-70 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)]" />
          <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                Reforma Tributária
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold leading-tight md:text-3xl">
                A escolha para 2027 já começa em 2026
              </h2>
              <p className="mt-3 max-w-xl text-white/90">
                {prazoAberto
                  ? "Para empresas já constituídas, a opção pelo regime de IBS e CBS do 1º semestre de 2027 vai de 1º a 30 de setembro de 2026. Simule os cenários antes de decidir."
                  : "Simples Comum, Simples Híbrido, créditos e Split Payment: quem se planeja transforma a mudança em vantagem. Simule os cenários da sua empresa."}
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <a
                href={whatsappLink(
                  "Olá! Quero ajuda para decidir entre Simples Comum e Simples Híbrido na Reforma Tributária."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-vermelho-escuro shadow-card transition-transform hover:scale-[1.02]"
              >
                <WhatsAppIcon className="h-5 w-5" /> Quero simular minha empresa
              </a>
              <Link
                href={servicoPath("planejamento-tributario")}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white hover:underline"
              >
                Ver planejamento tributário <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* BLOG RECENTE */}
      {posts.length > 0 && (
        <section className="bg-nevoa py-20">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
                  Blog
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold text-azul-escuro">
                  Contabilidade explicada sem complicação
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-vermelho hover:underline"
              >
                Ver todos <ArrowIcon className="h-4 w-4" />
              </Link>
            </Reveal>
            <Reveal delay={120} className="mt-10 grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* PERGUNTAS FREQUENTES */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <Reveal className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
            Dúvidas frequentes
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-azul-escuro">
            Perguntas que os empresários sempre fazem
          </h2>
        </Reveal>
        <Reveal delay={120} className="mt-10">
          <Faq perguntas={faqGeral} />
        </Reveal>
      </section>

      {/* CONTATO / CTA */}
      <section id="contato" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-24">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-azul-escuro to-azul-profundo p-6 text-branco sm:p-8 md:p-14">
          <div className="arco-marca -bottom-64 -left-40 h-96 w-96" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center md:gap-10">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Vamos simplificar a sua contabilidade?
              </h2>
              <p className="mt-4 max-w-md text-cinza-claro/90">
                Chame a Start Cont no WhatsApp. Entendemos o seu momento e
                mostramos o caminho mais simples para você ou para a sua empresa.
              </p>
              <a
                href={whatsappLink(mensagemPadrao)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-vermelho px-7 py-3.5 font-semibold text-white shadow-card transition-transform hover:scale-[1.02]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {site.telefoneExibicao}
              </a>
            </div>
            <div className="rounded-2xl bg-white/5 p-5 sm:p-7">
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-6 w-6 shrink-0 text-vermelho-claro" />
                <div>
                  <p className="font-display font-semibold">Onde atendemos</p>
                  <p className="mt-1 text-sm text-cinza-claro/85">
                    Presencial em toda a {site.cidadeBase.regiao}:{" "}
                    {site.areaAtendida.join(", ")}.
                    <br />
                    Online para empresas e pessoas de todo o Brasil.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-3">
                <PhoneIcon className="mt-0.5 h-6 w-6 shrink-0 text-vermelho-claro" />
                <div className="w-full">
                  <p className="font-display font-semibold">Canais de atendimento</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-cinza-claro/85">
                    <li className="flex items-center gap-2">
                      <WhatsAppIcon className="h-4 w-4 shrink-0" />
                      <a
                        href={whatsappLink(mensagemPadrao)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-branco hover:underline"
                      >
                        WhatsApp {site.telefoneExibicao}
                      </a>
                      <span className="text-xs text-cinza-claro/60">(preferencial)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 shrink-0" />
                      <a href={`tel:${site.telefoneE164}`} className="hover:underline">
                        Telefone {site.telefoneExibicao}
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4 shrink-0" />
                      <a href={`mailto:${site.email}`} className="break-all hover:underline">
                        {site.email}
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <InstagramIcon className="h-4 w-4 shrink-0" />
                      <a
                        href={site.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {site.instagramHandle}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
                <iframe
                  title="Mapa — Belo Horizonte, área de atendimento da Start Cont"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    "Belo Horizonte, MG"
                  )}&z=10&output=embed`}
                  className="block h-48 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
