import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [totalPosts, publicados, totalLeads, leadsRecentes] = await Promise.all(
    [
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.lead.count(),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]
  );

  const cards = [
    { label: "Posts publicados", value: publicados, href: "/admin/posts" },
    { label: "Posts no total", value: totalPosts, href: "/admin/posts" },
    { label: "Contatos recebidos", value: totalLeads, href: "/admin/leads" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-azul-escuro">
        Bem-vindo(a) ao painel
      </h1>
      <p className="mt-1 text-cinza">
        Gerencie os posts do blog e acompanhe os contatos recebidos.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-cinza-claro bg-white p-6 shadow-suave transition-all hover:-translate-y-0.5 hover:shadow-card"
          >
            <p className="font-display text-3xl font-bold text-azul">
              {c.value}
            </p>
            <p className="mt-1 text-sm text-cinza-escuro">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/posts/novo"
          className="rounded-xl bg-vermelho px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-vermelho-escuro"
        >
          + Escrever novo post
        </Link>
        <Link
          href="/admin/leads"
          className="rounded-xl border border-cinza-claro bg-white px-5 py-3 text-sm font-semibold text-cinza-escuro hover:bg-nevoa"
        >
          Ver contatos
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-azul-escuro">
          Últimos contatos
        </h2>
        {leadsRecentes.length === 0 ? (
          <p className="mt-3 text-sm text-cinza">
            Nenhum contato recebido ainda.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-cinza-claro overflow-hidden rounded-2xl border border-cinza-claro bg-white">
            {leadsRecentes.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between px-5 py-3.5 text-sm"
              >
                <span className="font-medium text-tinta">{l.nome}</span>
                <span className="text-right text-cinza">
                  {l.cidade} · {l.telefone}
                  {l.interesse && (
                    <span className="block text-xs text-vermelho-escuro">
                      {l.interesse}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
