import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default async function EditarPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, authors] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.author.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, role: true },
    }),
  ]);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-azul-escuro">
        Editar post
      </h1>
      <p className="mt-1 text-cinza">Atualize o conteúdo e salve.</p>
      <div className="mt-8">
        <PostEditor
          authors={authors}
          post={{
            id: post.id,
            title: post.title,
            content: post.content,
            coverImage: post.coverImage,
            published: post.published,
            authorId: post.authorId,
          }}
        />
      </div>
    </div>
  );
}
