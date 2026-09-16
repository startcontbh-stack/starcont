"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-cinza-escuro"
        >
          Senha de acesso
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          placeholder="••••••••"
          className="w-full rounded-xl border border-cinza-claro bg-white px-4 py-3 text-tinta outline-none transition focus:border-azul focus:ring-2 focus:ring-azul/20"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-azul px-6 py-3 font-semibold text-white transition-colors hover:bg-azul-escuro disabled:opacity-70"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
