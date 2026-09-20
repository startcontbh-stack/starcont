import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { TAMANHO_MAX_BYTES, TAMANHO_MAX_MB, TIPOS_ACEITOS } from "@/lib/portal";

/**
 * Upload dos anexos do cliente (extrato bancário em PDF, prints).
 *
 * O arquivo sobe por aqui assim que o cliente escolhe, e só a URL vai no
 * formulário. Server Action recebendo o PDF inteiro esbarraria no limite de
 * corpo da requisição — extrato de banco passa de 1 MB sem dificuldade.
 *
 * Produção (Vercel): Vercel Blob, se BLOB_READ_WRITE_TOKEN existir.
 * Dev: salva em /public/uploads.
 */
export async function POST(request: Request) {
  if (!(await isAuthenticated("portal"))) {
    return NextResponse.json(
      { ok: false, error: "Sessão expirada. Entre novamente." },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const competencia = String(formData.get("competencia") ?? "").slice(0, 7);

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Nenhum arquivo enviado." },
      { status: 400 }
    );
  }

  if (!TIPOS_ACEITOS.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: "Envie um PDF ou uma imagem (JPG, PNG)." },
      { status: 400 }
    );
  }

  if (file.size > TAMANHO_MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: `Arquivo maior que ${TAMANHO_MAX_MB} MB.` },
      { status: 400 }
    );
  }

  const ext = (file.name.split(".").pop() || "pdf").toLowerCase().slice(0, 5);
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "documento";
  const pasta = /^\d{4}-\d{2}$/.test(competencia) ? competencia : "sem-competencia";
  const filename = `${base}-${Date.now()}.${ext}`;

  const resposta = {
    ok: true as const,
    nome: file.name,
    tipo: file.type,
    tamanho: file.size,
  };

  // Vercel Blob (produção)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`envios/${pasta}/${filename}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return NextResponse.json({ ...resposta, url: blob.url });
  }

  // Dev: filesystem local
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads", "envios", pasta);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({
    ...resposta,
    url: `/uploads/envios/${pasta}/${filename}`,
  });
}
