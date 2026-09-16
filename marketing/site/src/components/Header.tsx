"use client";

import Link from "next/link";
import { useState } from "react";
import { mensagemPadrao, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./Icons";
import { Logo } from "./Logo";

const links = [
  { href: "/#sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/#equipe", label: "Equipe" },
  { href: "/blog", label: "Blog" },
  { href: "/#contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-cinza-claro/70 bg-branco/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="Start Cont — início">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-cinza-escuro transition-colors hover:text-vermelho"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={whatsappLink(mensagemPadrao)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-vermelho px-5 py-2.5 text-sm font-semibold text-white shadow-suave transition-colors hover:bg-vermelho-escuro"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Fale conosco
          </a>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-azul-escuro transition ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-azul-escuro transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-azul-escuro transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      {open && (
        <nav className="border-t border-cinza-claro bg-branco px-5 py-4 md:hidden" aria-label="Principal">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-cinza-escuro hover:bg-nevoa"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={whatsappLink(mensagemPadrao)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-vermelho px-5 py-3 text-sm font-semibold text-white"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Falar pelo WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
