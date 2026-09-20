import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import {
  categoriaValida,
  competenciaValida,
  TAMANHO_MAX_BYTES,
  TAMANHO_MAX_MB,
  tipoPermitido,
} from "@/lib/portal";

/**
 * Upload dos anexos do cliente — notas, boletos, extratos, documentos de DP.
 *
 * O arquivo sobe por aqui assim que o cliente escolhe, e só a URL vai no
 * formulário. Server Action recebendo os PDFs inteiros esbarraria no limite
 * de corpo da requisição — um malote de notas passa disso com folga.
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
  const competencia = String(formData.get("competencia") ?? "");
  const categoria = String(formData.get("categoria") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Nenhum arquivo enviado." },
      { status: 400 }
    );
  }

  if (!categoriaValida(categoria)) {
    return NextResponse.json(
      { ok: false, error: "Categoria de documento inválida." },
      { status: 400 }
    );
  }

  if (!tipoPermitido(file.name)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Formato não aceito. Envie PDF, imagem, XML, planilha ou ZIP.",
      },
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
  const pasta = competenciaValida(competencia) ? competencia : "sem-periodo";
  const filename = `${base}-${Date.now()}.${ext}`;

  const resposta = {
    ok: true as const,
    categoria,
    nome: file.name,
    tipo: file.type || "application/octet-stream",
    tamanho: file.size,
  };

  // Vercel Blob (produção)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`envios/${pasta}/${categoria}/${filename}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return NextResponse.json({ ...resposta, url: blob.url });
  }

  // Dev: filesystem local
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "envios",
    pasta,
    categoria
  );
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({
    ...resposta,
    url: `/uploads/envios/${pasta}/${categoria}/${filename}`,
  });
}
