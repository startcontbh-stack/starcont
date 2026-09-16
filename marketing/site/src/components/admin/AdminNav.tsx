"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { logout } from "@/app/admin/actions";

const items = [
  { href: "/admin", label: "Início" },
  { href: "/admin/posts", label: "Posts do blog" },
  { href: "/admin/autores", label: "Autores" },
  { href: "/admin/leads", label: "Contatos (CRM)" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col gap-2 border-b border-cinza-claro bg-white p-4 md:h-screen md:w-64 md:border-b-0 md:border-r md:p-6">
      <div className="mb-4 hidden md:block">
        <Logo showTagline={false} />
      </div>
      <nav className="flex gap-2 md:flex-col">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-azul text-white"
                  : "text-cinza-escuro hover:bg-nevoa"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto hidden flex-col gap-2 md:flex">
        <Link
          href="/"
          target="_blank"
          className="rounded-xl px-4 py-2.5 text-sm text-cinza hover:bg-nevoa"
        >
          Ver site ↗
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-xl px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
