import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";
import { isAuthenticated } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Painel · Entrar",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-nevoa px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl border border-cinza-claro bg-white p-8 shadow-card">
          <h1 className="font-display text-xl font-semibold text-azul-escuro">
            Painel da Start Cont
          </h1>
          <p className="mt-1 text-sm text-cinza">
            Acesso restrito à equipe Start Cont.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
