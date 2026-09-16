import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Texto limpo e com tamanho máximo (o endpoint é público). */
function campo(valor: unknown, max: number) {
  return String(valor ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nome = campo(body.nome, 120);
    const cidade = campo(body.cidade, 120);
    const telefone = campo(body.telefone, 40);
    const interesse = campo(body.interesse, 120) || null;
    const origem = campo(body.origem, 80) || "site";

    if (!nome || !cidade || !telefone) {
      return NextResponse.json(
        { ok: false, error: "Preencha nome, cidade e telefone." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: { nome, cidade, telefone, interesse, origem },
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao registrar contato." },
      { status: 500 }
    );
  }
}
