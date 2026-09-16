import Link from "next/link";
import type { Author, Post } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { ArrowIcon } from "./Icons";
import { LogoMark } from "./Logo";

/** Capa padrão quando o post não tem imagem — fundo da marca com o símbolo. */
export function CapaPadrao({ className = "h-48" }: { className?: string }) {
  return (
    <div
      className={`relative grid w-full place-items-center overflow-hidden bg-gradient-to-br from-azul-escuro to-azul-profundo ${className}`}
    >
      <div className="arco-marca -right-16 -top-20 h-48 w-48" />
      <LogoMark className="h-14 w-14 opacity-90" idPrefix="sc-capa" />
    </div>
  );
}

export function PostCard({
  post,
  headingLevel = "h3",
  compact = false,
}: {
  post: Post & { author?: Author | null };
  headingLevel?: "h2" | "h3";
  compact?: boolean;
}) {
  const Heading = headingLevel;
  const altura = compact ? "h-40" : "h-48";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-cinza-claro bg-branco shadow-suave transition-all hover:-translate-y-1 hover:shadow-card"
    >
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          className={`${altura} w-full object-cover`}
        />
      ) : (
        <CapaPadrao className={altura} />
      )}
      <div className={`flex flex-1 flex-col ${compact ? "p-5" : "p-6"}`}>
        <span className="text-xs text-cinza">
          {formatDate(post.createdAt)}
          {post.author ? ` · ${post.author.name}` : ""}
        </span>
        <Heading className="mt-2 font-display text-lg font-semibold text-azul-escuro group-hover:text-vermelho">
          {post.title}
        </Heading>
        {!compact && post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-cinza-escuro">
            {post.excerpt}
          </p>
        )}
        {!compact && (
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-vermelho">
            Ler artigo <ArrowIcon className="h-4 w-4" />
          </span>
        )}
      </div>
    </Link>
  );
}
