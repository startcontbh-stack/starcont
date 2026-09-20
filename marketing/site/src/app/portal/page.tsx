import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { EnvioForm } from "@/components/portal/EnvioForm";
import { logoutPortal } from "./actions";
import { isAuthenticated } from "@/lib/auth";
import { competenciasRecentes } from "@/lib/portal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Área do cliente",
  robots: { index: false, follow: false },
};

// A lista de meses é calculada a partir da data de hoje — nada de cache.
export const dynamic = "force-dynamic";

export default async function PortalPage() {
  if (!(await isAuthenticated("portal"))) redirect("/portal/login");

  return (
    <main className="min-h-screen bg-nevoa">
      <header className="border-b border-cinza-claro bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" aria-label="Start Cont — início">
            <Logo showTagline={false} />
          </Link>
          <form action={logoutPortal}>
            <button
              type="submit"
              className="rounded-lg px-3 py-2 text-sm font-medium text-cinza transition hover:bg-nevoa hover:text-cinza-escuro"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
        <h1 className="font-display text-2xl font-bold text-azul-escuro sm:text-3xl">
          Envio de documentos
        </h1>
        <p className="mt-2 leading-relaxed text-cinza-escuro">
          Só o <strong>período</strong>, o <strong>nome</strong> e o{" "}
          <strong>CNPJ ou CPF</strong> são obrigatórios. Os campos de documento
          são todos opcionais — anexe o que tiver no período, quantos arquivos
          quiser em cada um. A {site.nome} recebe tudo separado do outro lado.
        </p>

        <div className="mt-8">
          <EnvioForm competencias={competenciasRecentes()} />
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-cinza">
          Seus documentos ficam acessíveis apenas para a equipe da {site.nome}.
          <br />
          Dúvidas? Chame no WhatsApp {site.telefoneExibicao}.
        </p>
      </div>
    </main>
  );
}
