import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteAuthor } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AutoresListPage() {
  const autores = await prisma.author.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-azul-escuro">
            Autores do blog
          </h1>
          <p className="mt-1 text-cinza">
            Cadastre quem assina os artigos do blog — com foto, registro (CRC)
            e biografia (autoridade / E-E-A-T).
          </p>
        </div>
        <Link
          href="/admin/autores/novo"
          className="rounded-xl bg-vermelho px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-vermelho-escuro"
        >
          + Novo autor
        </Link>
      </div>

      {autores.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-cinza-claro bg-white p-12 text-center text-cinza">
          Nenhum autor cadastrado ainda.
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {autores.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-4 rounded-2xl border border-cinza-claro bg-white p-5 shadow-suave sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-4">
                {a.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.image}
                    alt={a.name}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-nevoa text-lg font-semibold text-cinza">
                    {a.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold text-azul-escuro">
                    {a.name}
                  </p>
                  <p className="truncate text-sm text-cinza">{a.role}</p>
                  <p className="text-xs text-cinza">
                    {a.credential ? `${a.credential} · ` : ""}
                    {a._count.posts} artigo{a._count.posts === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Link
                  href={`/admin/autores/${a.id}`}
                  className="rounded-lg border border-cinza-claro px-3 py-2 text-sm font-medium text-cinza-escuro hover:bg-nevoa"
                >
                  Editar
                </Link>
                <form action={deleteAuthor}>
                  <input type="hidden" name="id" value={a.id} />
                  <button
                    type="submit"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
