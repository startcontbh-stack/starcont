import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AuthorEditor } from "@/components/admin/AuthorEditor";

export const dynamic = "force-dynamic";

export default async function EditarAutorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-azul-escuro">
        Editar autor
      </h1>
      <p className="mt-1 text-cinza">Atualize os dados e salve.</p>
      <div className="mt-8">
        <AuthorEditor author={author} />
      </div>
    </div>
  );
}
