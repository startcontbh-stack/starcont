"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { saveAuthor } from "@/app/admin/actions";

type AuthorData = {
  id?: string;
  name?: string;
  role?: string;
  credential?: string | null;
  bio?: string;
  image?: string | null;
  email?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  website?: string | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-azul px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-azul-escuro disabled:opacity-70"
    >
      {pending ? "Salvando..." : "Salvar autor"}
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border border-cinza-claro bg-white px-4 py-3 text-tinta outline-none transition focus:border-azul focus:ring-2 focus:ring-azul/20";

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-cinza-escuro">
        {label}
        {required && <span className="text-vermelho"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

export function AuthorEditor({ author }: { author?: AuthorData }) {
  const [image, setImage] = useState(author?.image ?? "");
  const [uploading, setUploading] = useState(false);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.ok) setImage(data.url);
    else alert(data.error || "Erro ao enviar imagem.");
  }

  return (
    <form action={saveAuthor} className="space-y-6">
      {author?.id && <input type="hidden" name="id" value={author.id} />}
      <input type="hidden" name="image" value={image} />

      {/* Foto */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-cinza-escuro">
          Foto do autor
        </label>
        {image ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="Foto"
              className="h-32 w-32 rounded-2xl object-cover"
            />
            <button
              type="button"
              onClick={() => setImage("")}
              className="absolute right-2 top-2 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white hover:bg-black/80"
            >
              Remover
            </button>
          </div>
        ) : (
          <label className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-cinza-claro bg-white text-center text-xs text-cinza transition hover:border-azul hover:text-azul">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
            {uploading ? "Enviando..." : "+ Foto"}
          </label>
        )}
      </div>

      <Field
        label="Nome completo"
        name="name"
        required
        defaultValue={author?.name}
        placeholder="Ex: Rodrigo Silva"
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Cargo / função"
          name="role"
          required
          defaultValue={author?.role}
          placeholder="Ex: Contador · Fundador da Start Cont"
        />
        <Field
          label="Registro profissional (CRC)"
          name="credential"
          defaultValue={author?.credential}
          placeholder="Ex: CRC-MG 000000/O"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-cinza-escuro">
          Biografia<span className="text-vermelho"> *</span>
        </label>
        <textarea
          name="bio"
          required
          rows={5}
          defaultValue={author?.bio}
          placeholder="Formação, experiência e áreas de atuação. Quanto mais completo, melhor para autoridade (E-E-A-T)."
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-cinza">
          Aparece na assinatura do artigo e na página do autor. Reforça a
          autoridade da Start Cont no Google (E-E-A-T).
        </p>
      </div>

      <div className="border-t border-cinza-claro pt-6">
        <h3 className="text-sm font-semibold text-azul-escuro">
          Perfis verificáveis (opcional)
        </h3>
        <p className="mb-4 mt-1 text-xs text-cinza">
          Links de perfis reforçam a autoria para o Google (viram{" "}
          <code>sameAs</code> nos dados estruturados).
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="E-mail"
            name="email"
            type="email"
            defaultValue={author?.email}
            placeholder="nome@startcont.com.br"
          />
          <Field
            label="Instagram"
            name="instagram"
            defaultValue={author?.instagram}
            placeholder="https://instagram.com/usuario"
          />
          <Field
            label="LinkedIn"
            name="linkedin"
            defaultValue={author?.linkedin}
            placeholder="https://linkedin.com/in/usuario"
          />
          <Field
            label="Site / outro"
            name="website"
            defaultValue={author?.website}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-cinza-claro pt-5">
        <SubmitButton />
        <Link
          href="/admin/autores"
          className="rounded-xl px-4 py-3 text-sm font-medium text-cinza hover:bg-nevoa"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
