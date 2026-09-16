import type { Author } from "@prisma/client";
import { site } from "./site";

type AuthorProfiles = Pick<Author, "instagram" | "linkedin" | "website">;

/** Perfis verificáveis do autor, com rótulo — usados nos links da página. */
export function authorLinks(a: AuthorProfiles) {
  return [
    a.website && { label: "Site", href: a.website },
    a.linkedin && { label: "LinkedIn", href: a.linkedin },
    a.instagram && { label: "Instagram", href: a.instagram },
  ].filter((x): x is { label: string; href: string } => !!x && x.href.trim().length > 0);
}

/** Perfis verificáveis do autor viram `sameAs` no JSON-LD (sinal de E-E-A-T). */
export function authorSameAs(a: AuthorProfiles): string[] {
  return authorLinks(a).map((l) => l.href);
}

/** URL absoluta da imagem, aceitando tanto caminho local (/equipe/..) quanto URL do Blob. */
export function absoluteImage(src?: string | null): string | undefined {
  if (!src) return undefined;
  return src.startsWith("http") ? src : `${site.url}${src}`;
}

export function authorPath(slug: string) {
  return `/blog/autor/${slug}`;
}

export function authorUrl(slug: string) {
  return `${site.url}${authorPath(slug)}`;
}

/** schema.org Person do autor — usado no artigo e na página de perfil. */
export function personSchema(a: Author) {
  const sameAs = authorSameAs(a);
  return {
    "@type": "Person" as const,
    name: a.name,
    url: authorUrl(a.slug),
    jobTitle: a.role,
    description: a.bio,
    ...(absoluteImage(a.image) ? { image: absoluteImage(a.image) } : {}),
    ...(a.credential ? { hasCredential: a.credential } : {}),
    ...(a.email ? { email: a.email } : {}),
    worksFor: {
      "@type": "AccountingService",
      "@id": `${site.url}/#empresa`,
      name: site.nomeCompleto,
      url: site.url,
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}
