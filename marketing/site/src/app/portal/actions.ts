"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  checkPassword,
  createSession,
  destroySession,
  isAuthenticated,
  senhaConfigurada,
} from "@/lib/auth";
import { protocolo, TIPOS_ACEITOS } from "@/lib/portal";

export type EstadoForm = { error?: string } | undefined;

// ---- Acesso do cliente ----
export async function loginPortal(
  _prev: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  if (!senhaConfigurada("portal")) {
    return {
      error:
        "A área do cliente ainda não foi liberada. Fale com a Start Cont pelo WhatsApp.",
    };
  }
  const senha = String(formData.get("password") ?? "");
  if (!checkPassword(senha, "portal")) {
    return { error: "Senha incorreta. Confira a senha que a Start Cont enviou." };
  }
  await createSession("portal");
  redirect("/portal");
}

export async function logoutPortal() {
  await destroySession("portal");
  redirect("/portal/login");
}

// ---- Envio mensal ----

/** Anexo já enviado pelo /api/portal/upload, como o formulário o devolve. */
type Anexo = { nome: string; url: string; tipo: string; tamanho: number };

function lerAnexos(bruto: string): Anexo[] {
  try {
    const lista = JSON.parse(bruto);
    if (!Array.isArray(lista)) return [];
    return lista
      .filter(
        (a): a is Anexo =>
          a &&
          typeof a.url === "string" &&
          typeof a.nome === "string" &&
          typeof a.tipo === "string" &&
          Number.isFinite(a.tamanho) &&
          TIPOS_ACEITOS.includes(a.tipo)
      )
      .slice(0, 20);
  } catch {
    return [];
  }
}

export async function criarEnvio(
  _prev: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  if (!(await isAuthenticated("portal"))) {
    redirect("/portal/login");
  }

  const nomeCliente = String(formData.get("nomeCliente") ?? "").trim();
  const empresa = String(formData.get("empresa") ?? "").trim() || null;
  const telefone = String(formData.get("telefone") ?? "").trim() || null;
  const competencia = String(formData.get("competencia") ?? "").trim();
  const semMovimento = formData.get("semMovimento") === "on";
  const observacoes = String(formData.get("observacoes") ?? "").trim() || null;
  const anexos = lerAnexos(String(formData.get("arquivos") ?? "[]"));

  // O campo de dinheiro é mascarado no navegador; o valor que conta vem em
  // centavos num hidden, pra não depender de reinterpretar "1.234,56".
  const centavosBruto = Number(formData.get("faturamentoCentavos"));
  const faturamentoCentavos =
    Number.isFinite(centavosBruto) && centavosBruto > 0
      ? Math.round(centavosBruto)
      : null;

  if (nomeCliente.length < 3) {
    return { error: "Informe seu nome e sobrenome." };
  }
  if (!/^\d{4}-\d{2}$/.test(competencia)) {
    return { error: "Escolha o mês de referência." };
  }
  if (!semMovimento && !faturamentoCentavos) {
    return {
      error:
        "Informe o faturamento do mês ou marque a opção de mês sem movimento.",
    };
  }
  if (anexos.length === 0) {
    return { error: "Anexe o extrato bancário do mês (PDF ou imagem)." };
  }

  const envio = await prisma.envio.create({
    data: {
      nomeCliente,
      empresa,
      telefone,
      competencia,
      semMovimento,
      observacoes,
      faturamentoCentavos: semMovimento ? null : faturamentoCentavos,
      arquivos: { create: anexos },
    },
  });

  revalidatePath("/admin/envios");
  revalidatePath("/admin");
  redirect(`/portal/enviado?p=${protocolo(envio.id)}`);
}
