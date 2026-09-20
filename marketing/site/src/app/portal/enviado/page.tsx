import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { isAuthenticated } from "@/lib/auth";
import { site, whatsappLink } from "@/lib/site";
import { CheckIcon, WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Envio recebido",
  robots: { index: false, follow: false },
};

export default async function EnviadoPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  if (!(await isAuthenticated("portal"))) redirect("/portal/login");
  const { p: protocolo } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-nevoa px-5 py-10">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Start Cont — início">
            <Logo />
          </Link>
        </div>

        <div className="rounded-3xl border border-cinza-claro bg-white p-8 shadow-card">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckIcon className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display text-xl font-semibold text-azul-escuro">
            Recebemos o seu envio
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-cinza-escuro">
            Está tudo com a {site.nome}. Se faltar alguma coisa, a gente chama
            você no WhatsApp.
          </p>

          {protocolo && (
            <p className="mt-5 rounded-xl bg-nevoa px-4 py-3 text-sm text-cinza-escuro">
              Protocolo{" "}
              <strong className="font-display tracking-widest text-azul-escuro">
                {protocolo}
              </strong>
            </p>
          )}

          <Link
            href="/portal"
            className="mt-6 inline-block w-full rounded-xl bg-azul px-6 py-3 font-semibold text-white transition-colors hover:bg-azul-escuro"
          >
            Enviar outro mês
          </Link>
        </div>

        <a
          href={whatsappLink(
            "Olá! Acabei de enviar meus documentos pela área do cliente e queria falar com vocês."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-vermelho hover:underline"
        >
          <WhatsAppIcon className="h-4 w-4" /> Falar com a {site.nome}
        </a>
      </div>
    </main>
  );
}
