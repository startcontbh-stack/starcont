import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// Upload de imagem de destaque do post.
// Produção (Vercel): usa Vercel Blob se BLOB_READ_WRITE_TOKEN existir.
// Dev: salva em /public/uploads.
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Nenhum arquivo enviado." },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { ok: false, error: "Envie um arquivo de imagem." },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() || "jpg";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagem";
  const filename = `${base}-${Date.now()}.${ext}`;

  // Vercel Blob (produção)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`blog/${filename}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return NextResponse.json({ ok: true, url: blob.url });
  }

  // Dev: filesystem local
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
}
