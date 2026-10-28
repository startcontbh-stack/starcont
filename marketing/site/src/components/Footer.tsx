import Link from "next/link";
import { mensagemPadrao, servicoPath, servicos, site, whatsappLink } from "@/lib/site";
import {
  InstagramIcon,
  LockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "./Icons";
import { Logo } from "./Logo";
import { PreferenciasCookies } from "./CookieConsent";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-azul-profundo text-cinza-claro">
      <div className="arco-marca -right-40 -top-56 h-96 w-96" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-3">
        <div>
          <Logo variant="light" size="lg" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cinza-claro/80">
            {site.tagline}
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-vermelho-claro">
            {site.slogan}
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-branco">
            Contato
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-cinza-claro/85">
            <li className="flex items-start gap-3">
              <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-vermelho-claro" />
              <span>
                {site.cidadeBase.cidade}/{site.cidadeBase.estado} · atendimento em
                toda a {site.cidadeBase.regiao}
                <br />
                Online para todo o Brasil
              </span>
            </li>
            <li className="flex items-center gap-3">
              <PhoneIcon className="h-5 w-5 shrink-0 text-vermelho-claro" />
              <a href={`tel:${site.telefoneE164}`} className="hover:text-branco">
                {site.telefoneExibicao}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MailIcon className="h-5 w-5 shrink-0 text-vermelho-claro" />
              <a href={`mailto:${site.email}`} className="break-all hover:text-branco">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <InstagramIcon className="h-5 w-5 shrink-0 text-vermelho-claro" />
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-branco"
              >
                {site.instagramHandle}
              </a>
            </li>
          </ul>
          <a
            href={whatsappLink(mensagemPadrao)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-vermelho px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vermelho-escuro"
          >
            <WhatsAppIcon className="h-4 w-4" /> Falar pelo WhatsApp
          </a>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-branco">
            Serviços
          </h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {servicos.map((s) => (
              <li key={s.slug}>
                <Link href={servicoPath(s.slug)} className="text-cinza-claro/85 hover:text-branco">
                  {s.titulo}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-sm">
            <li>
              <Link href="/#planos" className="text-cinza-claro/85 hover:text-branco">
                Planos e preços
              </Link>
            </li>
            <li>
              <Link href="/contabilidade-belo-horizonte" className="text-cinza-claro/85 hover:text-branco">
                Contabilidade em Belo Horizonte
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-cinza-claro/85 hover:text-branco">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/politica-de-privacidade" className="text-cinza-claro/85 hover:text-branco">
                Política de Privacidade
              </Link>
            </li>
            <li>
              <PreferenciasCookies className="text-cinza-claro/85 hover:text-branco" />
            </li>
            <li>
              <Link
                href="/portal"
                className="inline-flex items-center gap-1.5 text-cinza-claro/85 hover:text-branco"
              >
                <LockIcon className="h-4 w-4 text-vermelho-claro" />
                Área do cliente
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 pt-6 text-center text-xs leading-relaxed text-cinza-claro/60 sm:text-left">
          A Start Cont é uma empresa privada de assessoria contábil e consultoria empresarial, sem vínculo ou representação oficial com órgãos governamentais ou entidades públicas.
        </p>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-center text-xs text-cinza-claro/60 sm:flex-row sm:text-left">
          <span>
            © {new Date().getFullYear()} {site.nomeCompleto}
            {site.cnpj ? ` · CNPJ ${site.cnpj}` : ""}
            {site.crc ? ` · ${site.crc}` : ""}
          </span>
          <span>Proximidade · Confiança · Inovação · Resultados</span>
        </div>
      </div>
    </footer>
  );
}
