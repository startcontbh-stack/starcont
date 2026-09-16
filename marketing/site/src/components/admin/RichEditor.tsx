"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useCallback } from "react";

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`min-w-9 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-azul text-white"
          : "text-cinza-escuro hover:bg-nevoa"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const addImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert(data.error || "Erro ao enviar imagem.");
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const url = window.prompt("URL do link:");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-cinza-claro bg-nevoa px-2 py-2">
      <ToolbarButton
        title="Negrito"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <b>B</b>
      </ToolbarButton>
      <ToolbarButton
        title="Itálico"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <i>I</i>
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-cinza-claro" />
      <ToolbarButton
        title="Título"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        title="Subtítulo"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
      >
        H3
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-cinza-claro" />
      <ToolbarButton
        title="Lista"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        • Lista
      </ToolbarButton>
      <ToolbarButton
        title="Lista numerada"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        1. Lista
      </ToolbarButton>
      <ToolbarButton
        title="Citação"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        ❝
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-cinza-claro" />
      <ToolbarButton title="Link" onClick={setLink} active={editor.isActive("link")}>
        🔗
      </ToolbarButton>
      <ToolbarButton title="Inserir imagem" onClick={addImage}>
        🖼️
      </ToolbarButton>
    </div>
  );
}

export function RichEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: "tiptap prose-conteudo min-h-[320px] px-4 py-4 focus:outline-none",
        "data-placeholder": "Escreva o conteúdo do post aqui...",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return (
      <div className="min-h-[380px] rounded-xl border border-cinza-claro bg-white" />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-cinza-claro bg-white">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
