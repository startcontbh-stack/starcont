import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default async function NovoPostPage() {
  const authors = await prisma.author.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, role: true },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-azul-escuro">
        Novo post
      </h1>
      <p className="mt-1 text-cinza">Escreva e publique um artigo no blog da Start Cont.</p>
      <div className="mt-8">
        <PostEditor authors={authors} />
      </div>
    </div>
  );
}
