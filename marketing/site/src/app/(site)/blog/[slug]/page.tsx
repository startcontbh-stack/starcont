import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, readingTime } from "@/lib/utils";
import { ArrowIcon, WhatsAppIcon } from "@/components/Icons";
import { site, whatsappLink } from "@/lib/site";
import { AuthorBio } from "@/components/AuthorBio";
import { BreadcrumbJsonLd, JsonLd, empresaRef } from "@/components/JsonLd";
import { absoluteImage, authorPath, personSchema } from "@/lib/author";

export const revalidate = 3600;

// Lista vazia = cada artigo é gerado no primeiro acesso e fica em cache (ISR).
// O painel invalida o cache ao salvar, publicar ou excluir.
export function generateStaticParams() {
  return [];
}

async function getPost(slug: string) {
  return prisma.post.findFirst({
    where: { slug, published: true },
    include: { author: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Artigo não encontrado" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `/blog/${post.slug}`,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author ? [post.author.name] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { author } = post;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: absoluteImage(post.coverImage) ?? `${site.url}/opengraph-image`,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: "pt-BR",
    author: author ? personSchema(author) : empresaRef(),
    publisher: empresaRef(),
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <article>
      <JsonLd data={articleSchema} />
      <BreadcrumbJsonLd
        itens={[
          { nome: "Início", path: "/" },
          { nome: "Blog", path: "/blog" },
          { nome: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <header className="relative overflow-hidden bg-gradient-to-b from-azul-escuro to-azul-profundo py-16 text-branco">
        <div className="arco-marca -right-48 -top-56 h-96 w-96" />
        <div className="relative mx-auto max-w-3xl px-5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-cinza-claro/80 hover:text-branco"
          >
            <ArrowIcon className="h-4 w-4 rotate-180" /> Voltar ao blog
          </Link>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-3">
            {author?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.image}
                alt={author.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white/20"
              />
            )}
            <div className="text-sm text-cinza-claro/85">
              {author ? (
                <p>
                  Por{" "}
                  <Link
                    href={authorPath(author.slug)}
                    className="font-semibold text-branco hover:underline"
                  >
                    {author.name}
                  </Link>
                  {author.credential ? (
                    <span className="text-cinza-claro/70">
                      {" "}
                      · {author.credential}
                    </span>
                  ) : null}
                </p>
              ) : (
                <p className="font-medium text-branco">{site.nomeCompleto}</p>
              )}
              <p className="text-cinza-claro/70">
                <time dateTime={post.createdAt.toISOString()}>
                  {formatDate(post.createdAt)}
                </time>{" "}
                · {readingTime(post.content)} min de leitura
              </p>
            </div>
          </div>
        </div>
      </header>

      {post.coverImage && (
        <div className="mx-auto -mt-8 max-w-3xl px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="relative aspect-video w-full rounded-3xl object-cover shadow-card"
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-5 py-12">
        <div
          className="prose-conteudo"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {author && <AuthorBio author={author} />}

        <div className="mt-14 rounded-3xl bg-nevoa p-8 text-center">
          <h2 className="font-display text-xl font-semibold text-azul-escuro">
            Quer ajuda com isso na sua empresa?
          </h2>
          <p className="mt-2 text-sm text-cinza-escuro">
            Fale com a Start Cont pelo WhatsApp. Simplificamos o burocrático para
            você.
          </p>
          <a
            href={whatsappLink(
              `Olá! Li o artigo "${post.title}" e gostaria de falar com a Start Cont.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-vermelho px-6 py-3 font-semibold text-white transition-colors hover:bg-vermelho-escuro"
          >
            <WhatsAppIcon className="h-5 w-5" /> Falar no WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
