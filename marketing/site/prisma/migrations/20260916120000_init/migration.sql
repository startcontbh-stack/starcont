-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverImage" TEXT,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "credential" TEXT,
    "bio" TEXT NOT NULL,
    "image" TEXT,
    "email" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "interesse" TEXT,
    "origem" TEXT NOT NULL DEFAULT 'site',
    "status" TEXT NOT NULL DEFAULT 'entrou_em_contato',
    "profissional" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Author_slug_key" ON "Author"("slug");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed: autor principal (idempotente por slug).
-- Foto é placeholder — troque pelo painel (/admin → Autores) ou em public/equipe/rodrigo.webp.
-- Registro CRC em branco até o cliente informar.
INSERT INTO "Author" ("id", "name", "slug", "role", "credential", "bio", "image", "email", "updatedAt")
VALUES (
  'aut_rodrigo',
  'Rodrigo',
  'rodrigo',
  'Contador · Fundador da Start Cont',
  NULL,
  'Contador e fundador da Start Cont, assessoria contábil de Belo Horizonte. Atende pessoas físicas e empresas, da simples regularização ao acompanhamento mensal de grandes empresas e indústrias, com um trabalho humanizado e próximo dos empresários, que simplifica o burocrático e facilita o caminho de quem empreende.',
  '/equipe/rodrigo.webp',
  'startcontbh@outlook.com',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO NOTHING;

-- Seed: primeiro artigo do blog (a partir do carrossel "Reforma Tributária e Simples Nacional").
INSERT INTO "Post" ("id", "title", "slug", "coverImage", "content", "excerpt", "published", "authorId", "updatedAt")
VALUES (
  'post_reforma_simples',
  'Reforma Tributária e Simples Nacional: Simples Comum ou Simples Híbrido em 2027?',
  'reforma-tributaria-simples-nacional-simples-comum-ou-hibrido',
  NULL,
  $html$<p><strong>Resposta rápida:</strong> a partir de 2027, a empresa do Simples Nacional poderá manter o IBS e a CBS dentro do DAS (<strong>Simples Comum</strong>) ou apurá-los fora do DAS, pelo regime regular (<strong>Simples Híbrido</strong>). O Simples Comum tende a atender melhor quem vende para o consumidor final; o Simples Híbrido, quem vende para outras empresas que aproveitam créditos. Para empresas já constituídas, a opção para o 1º semestre de 2027 deve ser feita de <strong>1º a 30 de setembro de 2026</strong>.</p>
<h2>O que muda com a Reforma Tributária?</h2>
<p>A partir de 2027, novos tributos entram em cena:</p>
<ul>
<li><strong>IBS</strong> (Imposto sobre Bens e Serviços): vai substituir o ICMS e o ISS;</li>
<li><strong>CBS</strong> (Contribuição sobre Bens e Serviços): vai substituir o PIS e a Cofins;</li>
<li><strong>IPI</strong>: terá alíquota reduzida a zero para a maioria dos produtos, com exceções.</li>
</ul>
<blockquote><p>O ICMS e o ISS não desaparecem de imediato. A transição será gradual entre 2029 e 2032, com extinção total em 2033.</p></blockquote>
<h2>Como fica o Simples Nacional?</h2>
<p>A partir de 2027, a empresa do Simples Nacional poderá escolher entre duas formas de recolher o IBS e a CBS.</p>
<h3>Opção 1: Simples Comum</h3>
<p>O IBS e a CBS continuam dentro do DAS, como já é hoje. É o caminho mais simples, sem mudança na forma de pagamento.</p>
<h3>Opção 2: Simples Híbrido</h3>
<p>O IBS e a CBS ficam fora do DAS e são apurados pelo regime regular, à parte dos demais tributos do Simples.</p>
<p>A escolha certa depende do perfil da sua empresa e do seu mercado.</p>
<h2>Qual escolha é mais indicada para a sua empresa?</h2>
<h3>Simples Comum (IBS e CBS no DAS)</h3>
<p>Mais indicado para empresas que vendem principalmente para o consumidor final (pessoa física).</p>
<ul>
<li>Mais simplicidade</li>
<li>Menos obrigações acessórias</li>
<li>Não entra no Split Payment</li>
</ul>
<p><strong>Ideal para:</strong> comércio varejista, prestadores de serviços locais e negócios focados no consumidor final.</p>
<h3>Simples Híbrido (IBS e CBS fora do DAS)</h3>
<p>Mais indicado para empresas que vendem para outras empresas (pessoa jurídica) e querem gerar crédito de IBS e CBS para seus clientes.</p>
<ul>
<li>Permite o aproveitamento de créditos</li>
<li>Pode aumentar a competitividade</li>
<li>Entra no Split Payment</li>
</ul>
<p><strong>Ideal para:</strong> indústrias, atacadistas, distribuidores, prestadores de serviços para outras empresas e negócios B2B.</p>
<h2>O que muda para quem optar pelo Simples Híbrido?</h2>
<ul>
<li><strong>Apuração regular de IBS e CBS:</strong> a empresa passa a apurar esses tributos por fora do DAS, com regras próprias.</li>
<li><strong>Créditos tributários:</strong> poderá tomar crédito de IBS e CBS nas compras e despesas.</li>
<li><strong>Split Payment:</strong> o tributo será recolhido no momento do pagamento da venda.</li>
<li><strong>Impacto no fluxo de caixa:</strong> o valor do IBS e da CBS será retido automaticamente, reduzindo o que entra no caixa da empresa.</li>
</ul>
<h2>Como funciona o Split Payment?</h2>
<p>Nas operações sujeitas ao Split Payment, o pagamento é dividido automaticamente. O cliente paga, e o banco ou a plataforma de pagamento separa os valores:</p>
<ul>
<li>o <strong>valor líquido</strong> vai para a empresa vendedora;</li>
<li>o <strong>IBS e a CBS</strong> são recolhidos diretamente ao governo.</li>
</ul>
<blockquote><p>O Split Payment será implementado de forma gradual e progressiva a partir de 2027.</p></blockquote>
<h2>Qual o impacto no fluxo de caixa?</h2>
<p>No Simples Híbrido, parte do valor de cada venda é retida automaticamente para o pagamento do IBS e da CBS:</p>
<ul>
<li><strong>Simples Comum:</strong> você recebe 100% do valor da venda no caixa.</li>
<li><strong>Simples Híbrido:</strong> você recebe o valor líquido da venda, ou seja, 100% menos o IBS e a CBS.</li>
</ul>
<p>Isso pode afetar o planejamento financeiro e a necessidade de capital de giro da empresa.</p>
<h2>O que fazer em 2026?</h2>
<ol>
<li><strong>Analise seu perfil de clientes:</strong> você vende mais para o consumidor final ou para outras empresas?</li>
<li><strong>Simule os cenários:</strong> compare carga tributária, créditos e impacto no fluxo de caixa em cada opção.</li>
<li><strong>Converse com quem entende:</strong> a decisão certa exige análise, planejamento e estratégia.</li>
</ol>
<p><strong>A escolha para 2027 já começa em 2026.</strong> Para empresas já constituídas, a opção pelo Simples Nacional e a escolha pelo regime regular de IBS e CBS para o 1º semestre de 2027 devem ser feitas de <strong>1º a 30 de setembro de 2026</strong>.</p>
<h2>Não existe uma escolha melhor para todas as empresas</h2>
<p>Existe a escolha mais adequada para a sua. A Reforma Tributária chegou para ficar, e quem se planeja, se antecipa e faz as escolhas certas transforma a mudança em vantagem.</p>
<p>Conheça o <a href="/servicos/planejamento-tributario">planejamento tributário da Start Cont</a> ou fale com a gente pelo WhatsApp para descobrir o melhor caminho para o futuro da sua empresa.</p>$html$,
  'Simples Comum ou Simples Híbrido? Entenda o que muda no Simples Nacional com o IBS, a CBS e o Split Payment e como escolher a melhor opção para a sua empresa em 2027.',
  true,
  'aut_rodrigo',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO NOTHING;
