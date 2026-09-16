import Link from "next/link";
import type { Author } from "@prisma/client";
import { authorLinks, authorPath } from "@/lib/author";

/** Cartão "Sobre o autor" — assinatura rica ao pé do artigo (E-E-A-T). */
export function AuthorBio({
  author,
  heading = true,
}: {
  author: Author;
  heading?: boolean;
}) {
  const links = authorLinks(author);
  return (
    <div className="mt-14 rounded-3xl border border-cinza-claro bg-white p-6 shadow-suave sm:p-8">
      {heading && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-vermelho">
          Sobre o autor
        </p>
      )}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {author.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={author.image}
            alt={author.name}
            className="h-20 w-20 shrink-0 rounded-2xl object-cover"
          />
        )}
        <div className="min-w-0">
          <Link
            href={authorPath(author.slug)}
            className="font-display text-lg font-semibold text-azul-escuro hover:text-vermelho"
          >
            {author.name}
          </Link>
          <p className="text-sm text-cinza">
            {author.role}
            {author.credential ? ` · ${author.credential}` : ""}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cinza-escuro">
            {author.bio}
          </p>
          {links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
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
        </div>
      </div>
    </div>
  );
}
