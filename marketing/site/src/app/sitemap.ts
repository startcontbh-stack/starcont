import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { servicoPath, servicos, site } from "@/lib/site";

// Revalidado a cada hora — posts novos entram no sitemap sem novo deploy.
export const revalidate = 3600;

async function conteudoDoBlog() {
  try {
    const [posts, autores] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.author.findMany({
        where: { posts: { some: { published: true } } },
        select: { slug: true, updatedAt: true },
      }),
    ]);
    return { posts, autores };
  } catch (err) {
    console.error("[sitemap] banco indisponível, gerando só páginas fixas:", err);
    return { posts: [], autores: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const { posts, autores } = await conteudoDoBlog();

  const estaticas: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/servicos`, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${base}/contabilidade-belo-horizonte`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/politica-de-privacidade`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const paginasServico: MetadataRoute.Sitemap = servicos.map((s) => ({
    url: `${base}${servicoPath(s.slug)}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const artigos: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const perfis: MetadataRoute.Sitemap = autores.map((a) => ({
    url: `${base}/blog/autor/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...estaticas, ...paginasServico, ...artigos, ...perfis];
}
