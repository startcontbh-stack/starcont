import { prisma } from "./prisma";

/**
 * Posts publicados para listagens (home, /blog, sitemap).
 *
 * Se o banco estiver indisponível a listagem sai vazia em vez de derrubar a
 * página inteira — o site institucional continua no ar. A página do artigo
 * (/blog/[slug]) não usa isto de propósito: lá o erro precisa subir para o
 * ISR manter a versão anterior em cache em vez de gravar um 404.
 */
export async function getPublishedPosts(take?: number) {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { author: true },
      take,
    });
  } catch (err) {
    console.error("[posts] falha ao listar posts publicados:", err);
    return [];
  }
}
