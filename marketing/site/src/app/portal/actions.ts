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
import {
  apenasDigitos,
  categoriaValida,
  competenciaValida,
  documentoValido,
  MAX_ARQUIVOS,
  protocolo,
  tipoPermitido,
} from "@/lib/portal";

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

// ---- Envio do malote ----

/** Anexo já enviado pelo /api/portal/upload, como o formulário o devolve. */
type Anexo = {
  categoria: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
};

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
          categoriaValida(a.categoria) &&
          tipoPermitido(a.nome)
      )
      .slice(0, MAX_ARQUIVOS);
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
  const documento = apenasDigitos(String(formData.get("documento") ?? ""));
  const telefone = String(formData.get("telefone") ?? "").trim() || null;
  const competenciaInicio = String(formData.get("competenciaInicio") ?? "").trim();
  const competenciaFim = String(formData.get("competenciaFim") ?? "").trim();
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

  // Só período, nome e documento travam o envio. Os anexos são todos
  // opcionais — nem todo cliente tem movimento em todas as categorias.
  if (!competenciaValida(competenciaInicio) || !competenciaValida(competenciaFim)) {
    return { error: "Escolha o período do envio." };
  }
  if (competenciaFim < competenciaInicio) {
    return { error: "O mês final do período não pode ser anterior ao inicial." };
  }
  if (nomeCliente.length < 3) {
    return { error: "Informe o nome do cliente." };
  }
  if (!documentoValido(documento)) {
    return {
      error:
        documento.length === 0
          ? "Informe o CNPJ ou o CPF."
          : "CNPJ ou CPF inválido. Confira os números digitados.",
    };
  }

  const envio = await prisma.envio.create({
    data: {
      nomeCliente,
      documento,
      telefone,
      competenciaInicio,
      competenciaFim,
      semMovimento,
      observacoes,
      faturamentoCentavos: semMovimento ? null : faturamentoCentavos,
      arquivos: {
        create: anexos.map((a) => ({
          categoria: a.categoria,
          nome: a.nome,
          url: a.url,
          tipo: a.tipo,
          tamanho: a.tamanho,
        })),
      },
    },
  });

  revalidatePath("/admin/envios");
  revalidatePath("/admin");
  redirect(`/portal/enviado?p=${protocolo(envio.id)}`);
}
