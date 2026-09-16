"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { RichEditor } from "./RichEditor";
import { savePost } from "@/app/admin/actions";

type PostData = {
  id?: string;
  title?: string;
  content?: string;
  coverImage?: string | null;
  published?: boolean;
  authorId?: string | null;
};

type AuthorOption = { id: string; name: string; role: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-azul px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-azul-escuro disabled:opacity-70"
    >
      {pending ? "Salvando..." : "Salvar post"}
    </button>
  );
}

export function PostEditor({
  post,
  authors = [],
}: {
  post?: PostData;
  authors?: AuthorOption[];
}) {
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.ok) setCoverImage(data.url);
    else alert(data.error || "Erro ao enviar imagem.");
  }

  return (
    <form action={savePost} className="space-y-6">
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="coverImage" value={coverImage} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-cinza-escuro">
          Título do post
        </label>
        <input
          name="title"
          required
          defaultValue={post?.title}
          placeholder="Ex: MEI ou microempresa: quando vale a pena mudar?"
          className="w-full rounded-xl border border-cinza-claro bg-white px-4 py-3 font-display text-lg text-tinta outline-none transition focus:border-azul focus:ring-2 focus:ring-azul/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-cinza-escuro">
          Autor
        </label>
        {authors.length === 0 ? (
          <p className="rounded-xl border border-dashed border-cinza-claro bg-white px-4 py-3 text-sm text-cinza">
            Nenhum autor cadastrado.{" "}
            <Link href="/admin/autores/novo" className="font-medium text-azul">
              Cadastrar autor
            </Link>{" "}
            para assinar o artigo.
          </p>
        ) : (
          <select
            name="authorId"
            defaultValue={post?.authorId ?? ""}
            className="w-full rounded-xl border border-cinza-claro bg-white px-4 py-3 text-tinta outline-none transition focus:border-azul focus:ring-2 focus:ring-azul/20"
          >
            <option value="">Sem autor (assinado pela Start Cont)</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} — {a.role}
              </option>
            ))}
          </select>
        )}
        <p className="mt-1.5 text-xs text-cinza">
          O autor aparece na assinatura do artigo e nos dados estruturados de
          SEO (E-E-A-T do Google).
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-cinza-escuro">
          Imagem de destaque
        </label>
        {coverImage ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt="Capa"
              className="h-44 w-full max-w-md rounded-xl object-cover"
            />
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="absolute right-2 top-2 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white hover:bg-black/80"
            >
              Remover
            </button>
          </div>
        ) : (
          <label className="flex h-32 max-w-md cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-cinza-claro bg-white text-sm text-cinza transition hover:border-azul hover:text-azul">
            <input
              type="file"
              accept="image/*"
              onChange={handleCover}
              className="hidden"
            />
            {uploading ? "Enviando..." : "+ Selecionar imagem"}
          </label>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-cinza-escuro">
          Conteúdo
        </label>
        <RichEditor value={content} onChange={setContent} />
      </div>

      <label className="flex items-center gap-2.5">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? false}
          className="h-4 w-4 rounded border-cinza-claro text-azul focus:ring-azul"
        />
        <span className="text-sm text-cinza-escuro">
          Publicar agora (deixe desmarcado para salvar como rascunho)
        </span>
      </label>

      <div className="flex items-center gap-3 border-t border-cinza-claro pt-5">
        <SubmitButton />
        <Link
          href="/admin/posts"
          className="rounded-xl px-4 py-3 text-sm font-medium text-cinza hover:bg-nevoa"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
