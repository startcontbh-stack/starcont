import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { PortalLoginForm } from "@/components/portal/PortalLoginForm";
import { isAuthenticated } from "@/lib/auth";
import { whatsappLink } from "@/lib/site";
import { LockIcon, WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Área do cliente · Entrar",
  robots: { index: false, follow: false },
};

export default async function PortalLoginPage() {
  if (await isAuthenticated("portal")) redirect("/portal");

  return (
    <main className="flex min-h-screen items-center justify-center bg-nevoa px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Start Cont — início">
            <Logo />
          </Link>
        </div>

        <div className="rounded-3xl border border-cinza-claro bg-white p-8 shadow-card">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-azul/10 text-azul">
            <LockIcon className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-azul-escuro">
            Área do cliente
          </h1>
          <p className="mt-1 text-sm text-cinza">
            Envie o faturamento do mês e o extrato bancário para a Start Cont.
          </p>
          <div className="mt-6">
            <PortalLoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-cinza">
          Não tem a senha?{" "}
          <a
            href={whatsappLink(
              "Olá! Sou cliente da Start Cont e preciso da senha da área do cliente para enviar meus documentos."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-vermelho hover:underline"
          >
            <WhatsAppIcon className="h-4 w-4" /> Pedir no WhatsApp
          </a>
        </p>
        <p className="mt-2 text-center text-xs text-cinza/70">
          <Link href="/" className="hover:underline">
            Voltar para o site
          </Link>
        </p>
      </div>
    </main>
  );
}
