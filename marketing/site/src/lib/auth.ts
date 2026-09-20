import { cookies } from "next/headers";
import crypto from "crypto";

const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

/**
 * Dois acessos independentes, cada um com sua senha e seu cookie:
 *
 * - `admin`  → painel da equipe (/admin): posts, autores, CRM e envios
 * - `portal` → área do cliente (/portal): envio do faturamento e do extrato
 *
 * São separados de propósito. A senha que o contador dá para os clientes não
 * pode abrir o painel, e o escopo entra na assinatura do token, então um
 * cookie do portal não vira sessão de admin nem trocando o nome do cookie.
 */
export type Escopo = "admin" | "portal";

const ESCOPOS: Record<Escopo, { cookie: string; envSenha: string }> = {
  admin: { cookie: "startcont_admin", envSenha: "ADMIN_PASSWORD" },
  portal: { cookie: "startcont_portal", envSenha: "PORTAL_PASSWORD" },
};

/**
 * Segredo que assina o cookie. Em produção é obrigatório: sem ele nenhuma
 * sessão é aceita (um segredo padrão permitiria forjar o cookie).
 */
function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  return process.env.NODE_ENV === "production" ? null : "dev-secret-change-me";
}

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

// Token simples: "<escopo>:<expira>.<assinatura>"
function makeToken(escopo: Escopo, secret: string) {
  const payload = `${escopo}:${Date.now() + MAX_AGE * 1000}`;
  return `${payload}.${sign(payload, secret)}`;
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

function isValidToken(token: string | undefined, escopo: Escopo) {
  const secret = getSecret();
  if (!token || !secret) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!safeEqual(sign(payload, secret), sig)) return false;
  const [escopoToken, expira] = payload.split(":");
  if (escopoToken !== escopo) return false;
  return Number(expira) > Date.now();
}

/** A senha desse acesso já foi definida nas variáveis de ambiente? */
export function senhaConfigurada(escopo: Escopo = "admin") {
  return Boolean(process.env[ESCOPOS[escopo].envSenha]);
}

export function checkPassword(password: string, escopo: Escopo = "admin") {
  const expected = process.env[ESCOPOS[escopo].envSenha] || "";
  if (!expected) return false;
  // comparação em tempo constante
  return safeEqual(password, expected);
}

export async function createSession(escopo: Escopo = "admin") {
  const secret = getSecret();
  if (!secret) throw new Error("SESSION_SECRET não configurado.");
  const cookieStore = await cookies();
  cookieStore.set(ESCOPOS[escopo].cookie, makeToken(escopo, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(escopo: Escopo = "admin") {
  const cookieStore = await cookies();
  cookieStore.delete(ESCOPOS[escopo].cookie);
}

export async function isAuthenticated(escopo: Escopo = "admin") {
  const cookieStore = await cookies();
  return isValidToken(cookieStore.get(ESCOPOS[escopo].cookie)?.value, escopo);
}
