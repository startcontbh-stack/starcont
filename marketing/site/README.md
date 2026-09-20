# Start Cont — Site + Landing Page + Painel

App Next.js (App Router) no mesmo molde do site da NeuroClinic, com a identidade da
Start Cont (azul-marinho + vermelho):

- **Site institucional** (`/`) — hero, equipe, sobre, serviços, diferenciais,
  Reforma Tributária, blog, perguntas frequentes e contato
- **Páginas de serviço** (`/servicos` e `/servicos/[slug]`) — uma landing por serviço,
  com formulário, escopo, público, etapas, FAQ e dados estruturados
- **Landing page de conversão** (`/contabilidade-belo-horizonte`) — sem menu, para
  Google Ads: formulário → grava o lead no CRM → abre o WhatsApp
- **Blog** (`/blog`, `/blog/[slug]`, `/blog/autor/[slug]`) com autor (E-E-A-T)
- **Painel admin** (`/admin`) — login por senha, posts com editor rico e upload de
  imagem, autores, CRM de contatos em Kanban e os envios dos clientes
- **Área do cliente** (`/portal`) — login por senha própria, em formato de enquete:
  o cliente informa o faturamento do mês e anexa o extrato bancário; o contador
  vê tudo agrupado por mês em `/admin/envios` e baixa os arquivos

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4 (tema em `src/app/globals.css`)
- Prisma 6 + Postgres (Neon) — modelos `Post`, `Author` e `Lead`
- Tiptap (editor de texto rico)
- Vercel Blob (upload de imagem em produção)

## Onde editar o conteúdo

| O quê | Onde |
| --- | --- |
| Telefone, e-mail, Instagram, cidades atendidas, missão/visão/valores | `src/lib/site.ts` → `site` |
| Serviços (textos, SEO, FAQ de cada página) | `src/lib/site.ts` → `servicos` |
| Equipe (nome, cargo, frase) | `src/lib/site.ts` → `equipe` |
| Responsáveis que aparecem no CRM | `src/lib/site.ts` → `responsaveisCrm` |
| **Reel em destaque na home** | `src/lib/site.ts` → `reelDestaque` |
| **Reels do carrossel** | `src/lib/site.ts` → `reels` |
| **Fotos da equipe** | `public/equipe/*.webp` — `rodrigo.webp` já é a foto real; as outras ainda são placeholders (ver `public/equipe/README.txt`) |
| CNPJ e CRC (aparecem no rodapé e no schema) | `src/lib/site.ts` → `site.cnpj` / `site.crc` (em branco até o cliente informar) |
| Posts, autores e contatos | Painel `/admin` |

## Rodar localmente

```bash
cd marketing/site
npm install
vercel env pull .env        # traz DATABASE_URL etc. do projeto na Vercel
npx prisma migrate deploy   # cria as tabelas (e o post/autor iniciais)
npm run dev                 # http://localhost:3000
```

## Variáveis de ambiente

| Variável | Para que serve |
| --- | --- |
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | Conexões do Neon (criadas pela integração na Vercel). |
| `ADMIN_PASSWORD` | Senha do painel `/admin`. |
| `PORTAL_PASSWORD` | Senha da área do cliente `/portal` — a que circula no WhatsApp dos clientes. Sem ela, o `/portal` fica fechado. |
| `SESSION_SECRET` | Segredo que assina o cookie de sessão. **Obrigatório em produção.** |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp (só dígitos, com DDI). Padrão: `5531981211758`. |
| `NEXT_PUBLIC_SITE_URL` | Domínio próprio (ex.: `https://www.startcont.com.br`). Sem ele, usa o domínio de produção da Vercel. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Código do Google Search Console (opcional). |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Tag do Google Ads na landing page (opcional, ex.: `AW-123456789`). |
| `BLOB_READ_WRITE_TOKEN` | Upload de imagens do blog e dos anexos do portal em produção (criado com o Blob Store na Vercel). |

## Deploy (Vercel)

- Projeto na Vercel com **Root Directory = `marketing/site`**.
- O build (`npm run build`) roda `prisma migrate deploy` antes do `next build`.
- Integrações: **Neon** (banco) e **Blob** (imagens).

## SEO já implementado

Metadata por página (title, description, canonical, Open Graph), imagem de
compartilhamento gerada no build, `sitemap.xml` dinâmico (inclui posts e autores),
`robots.txt`, `manifest`, JSON-LD (`AccountingService`, `WebSite`, `Service`,
`FAQPage`, `BreadcrumbList`, `BlogPosting`, `ProfilePage`), páginas estáticas/ISR,
`noindex` no painel e na API. Detalhes e pendências em
`marketing/seo/04-otimizacao-on-page.md`.
