import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { deletePost, togglePublish } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function PostsListPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-azul-escuro">
            Posts do blog
          </h1>
          <p className="mt-1 text-cinza">
            Crie, edite, publique ou remova artigos.
          </p>
        </div>
        <Link
          href="/admin/posts/novo"
          className="rounded-xl bg-vermelho px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-vermelho-escuro"
        >
          + Novo post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-cinza-claro bg-white p-12 text-center text-cinza">
          Nenhum post ainda. Que tal escrever o primeiro?
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col gap-3 rounded-2xl border border-cinza-claro bg-white p-5 shadow-suave sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      post.published ? "bg-green-500" : "bg-cinza/40"
                    }`}
                  />
                  <span className="text-xs font-medium uppercase tracking-wide text-cinza">
                    {post.published ? "Publicado" : "Rascunho"}
                  </span>
                  <span className="text-xs text-cinza">
                    · {formatDate(post.createdAt)}
                  </span>
                </div>
                <p className="mt-1 truncate font-display font-semibold text-azul-escuro">
                  {post.title}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {post.published && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="rounded-lg px-3 py-2 text-sm text-cinza hover:bg-nevoa"
                  >
                    Ver ↗
                  </Link>
                )}
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="rounded-lg border border-cinza-claro px-3 py-2 text-sm font-medium text-cinza-escuro hover:bg-nevoa"
                >
                  Editar
                </Link>
                <form action={togglePublish}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-cinza-claro px-3 py-2 text-sm font-medium text-azul hover:bg-azul/5"
                  >
                    {post.published ? "Despublicar" : "Publicar"}
                  </button>
                </form>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
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
