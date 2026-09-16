import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { PostCard } from "@/components/PostCard";
import { authorLinks, personSchema } from "@/lib/author";

export const revalidate = 3600;

// Lista vazia = cada perfil é gerado no primeiro acesso e fica em cache (ISR).
// O painel invalida o cache ao salvar, publicar ou excluir.
export function generateStaticParams() {
  return [];
}

async function getAuthor(slug: string) {
  return prisma.author.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) return { title: "Autor não encontrado" };
  const title = `${author.name} — ${author.role}`;
  return {
    title,
    description: author.bio.slice(0, 160),
    alternates: { canonical: `/blog/autor/${author.slug}` },
    openGraph: {
      title,
      description: author.bio.slice(0, 160),
      url: `/blog/autor/${author.slug}`,
      images: author.image ? [author.image] : undefined,
      type: "profile",
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();

  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: personSchema(author),
  };

  const links = authorLinks(author);

  return (
    <div>
      <JsonLd data={profileSchema} />

      <header className="relative overflow-hidden bg-gradient-to-b from-azul-escuro to-azul-profundo py-16 text-branco">
        <div className="arco-marca -right-48 -top-56 h-96 w-96" />
        <div className="relative mx-auto max-w-3xl px-5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-cinza-claro/80 hover:text-branco"
          >
            <ArrowIcon className="h-4 w-4 rotate-180" /> Voltar ao blog
          </Link>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
            {author.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.image}
                alt={author.name}
                className="h-24 w-24 rounded-2xl object-cover ring-2 ring-white/20"
              />
            )}
            <div>
              <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl">
                {author.name}
              </h1>
              <p className="mt-1.5 text-cinza-claro/85">
                {author.role}
                {author.credential ? ` · ${author.credential}` : ""}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-lg leading-relaxed text-cinza-escuro">{author.bio}</p>

        {links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer author"
                className="font-medium text-vermelho hover:underline"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}

        <div className="mt-12 border-t border-cinza-claro pt-10">
          <h2 className="font-display text-xl font-bold text-azul-escuro">
            Artigos de {author.name.split(" ")[0]}
          </h2>

          {author.posts.length === 0 ? (
            <p className="mt-4 text-cinza">Ainda não há artigos publicados por este autor.</p>
          ) : (
            <div className="mt-6 grid gap-7 sm:grid-cols-2">
              {author.posts.map((post) => (
                <PostCard key={post.id} post={post} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
