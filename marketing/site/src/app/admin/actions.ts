"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  checkPassword,
  createSession,
  destroySession,
  isAuthenticated,
} from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { responsaveisCrm } from "@/lib/site";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    throw new Error("Não autorizado.");
  }
}

// ---- Auth ----
export async function login(
  _prev: { error?: string } | undefined,
  formData: FormData
) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Senha incorreta." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---- Posts ----
async function uniqueSlug(base: string, ignoreId?: string) {
  let slug = base || "post";
  let n = 1;
  // garante slug único
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) break;
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

function buildExcerpt(html: string) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 180 ? text.slice(0, 177) + "..." : text;
}

export async function savePost(formData: FormData) {
  await requireAuth();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const authorId = String(formData.get("authorId") ?? "").trim() || null;
  const published = formData.get("published") === "on";

  if (!title) return;

  const baseSlug = slugify(title);
  const excerpt = buildExcerpt(content);

  if (id) {
    const slug = await uniqueSlug(baseSlug, id);
    await prisma.post.update({
      where: { id },
      data: { title, slug, content, coverImage, excerpt, published, authorId },
    });
  } else {
    const slug = await uniqueSlug(baseSlug);
    await prisma.post.create({
      data: { title, slug, content, coverImage, excerpt, published, authorId },
    });
  }

  revalidatePath("/blog", "layout");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function togglePublish(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id"));
  const post = await prisma.post.findUnique({ where: { id } });
  if (post) {
    await prisma.post.update({
      where: { id },
      data: { published: !post.published },
    });
  }
  revalidatePath("/blog", "layout");
  revalidatePath("/");
  revalidatePath("/admin/posts");
}

export async function deletePost(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id"));
  await prisma.post.delete({ where: { id } });
  revalidatePath("/blog", "layout");
  revalidatePath("/");
  revalidatePath("/admin/posts");
}

// ---- Leads (CRM / Kanban) ----
const LEAD_STATUS = [
  "entrou_em_contato",
  "aguardando_fechamento",
  "fechado",
] as const;

export async function updateLeadStatus(id: string, status: string) {
  await requireAuth();
  if (!LEAD_STATUS.includes(status as (typeof LEAD_STATUS)[number])) return;
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
}

export async function setLeadProfissional(
  id: string,
  profissional: string | null
) {
  await requireAuth();
  const value =
    profissional &&
    responsaveisCrm.includes(profissional as (typeof responsaveisCrm)[number])
      ? profissional
      : null;
  await prisma.lead.update({ where: { id }, data: { profissional: value } });
  revalidatePath("/admin/leads");
}

export async function deleteLead(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id"));
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
}

// ---- Autores (equipe que assina os posts) ----
async function uniqueAuthorSlug(base: string, ignoreId?: string) {
  let slug = base || "autor";
  let n = 1;
  while (true) {
    const existing = await prisma.author.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) break;
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

function opt(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim() || null;
}

export async function saveAuthor(formData: FormData) {
  await requireAuth();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (!name || !role || !bio) return;

  const data = {
    name,
    role,
    bio,
    credential: opt(formData, "credential"),
    image: opt(formData, "image"),
    email: opt(formData, "email"),
    instagram: opt(formData, "instagram"),
    linkedin: opt(formData, "linkedin"),
    website: opt(formData, "website"),
  };

  if (id) {
    const slug = await uniqueAuthorSlug(slugify(name), id);
    await prisma.author.update({ where: { id }, data: { ...data, slug } });
  } else {
    const slug = await uniqueAuthorSlug(slugify(name));
    await prisma.author.create({ data: { ...data, slug } });
  }

  revalidatePath("/admin/autores");
  revalidatePath("/blog", "layout");
  redirect("/admin/autores");
}

export async function deleteAuthor(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id"));
  // Posts do autor têm authorId anulado automaticamente (onDelete: SetNull).
  await prisma.author.delete({ where: { id } });
  revalidatePath("/admin/autores");
  revalidatePath("/blog", "layout");
}
