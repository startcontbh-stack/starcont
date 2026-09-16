import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog de Contabilidade e Reforma Tributária",
  description:
    "Artigos da Start Cont sobre Reforma Tributária, Simples Nacional, abertura de empresa, Imposto de Renda e gestão — contabilidade explicada sem complicação.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog da Start Cont",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="bg-nevoa">
      <BreadcrumbJsonLd
        itens={[
          { nome: "Início", path: "/" },
          { nome: "Blog", path: "/blog" },
        ]}
      />
      <div className="mx-auto max-w-6xl px-5 py-16">
        <header className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-vermelho">
            Blog
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold text-azul-escuro">
            Contabilidade explicada sem complicação
          </h1>
          <p className="mt-4 text-cinza-escuro">
            Reforma Tributária, impostos, abertura de empresa e gestão — o que
            muda para você e para o seu negócio, em linguagem simples.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-cinza-claro bg-branco p-16 text-center">
            <p className="text-cinza">
              Ainda não publicamos artigos por aqui. Volte em breve!
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} headingLevel="h2" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
