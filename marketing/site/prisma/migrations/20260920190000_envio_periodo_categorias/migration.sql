-- Reestrutura o envio do portal para o formulário pedido pelo contador:
-- período (de/até), CPF ou CNPJ obrigatório e anexos separados por categoria.
--
-- As colunas novas entram com DEFAULT para o ALTER funcionar mesmo se já
-- houver linhas; o DEFAULT é removido logo depois, porque o valor passa a vir
-- sempre do formulário.

-- Envio: empresa sai, documento entra
ALTER TABLE "Envio" DROP COLUMN IF EXISTS "empresa";
ALTER TABLE "Envio" ADD COLUMN "documento" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Envio" ALTER COLUMN "documento" DROP DEFAULT;

-- Envio: competencia vira o início do período, e ganha o fim
ALTER TABLE "Envio" RENAME COLUMN "competencia" TO "competenciaInicio";
ALTER TABLE "Envio" ADD COLUMN "competenciaFim" TEXT NOT NULL DEFAULT '';
UPDATE "Envio" SET "competenciaFim" = "competenciaInicio" WHERE "competenciaFim" = '';
ALTER TABLE "Envio" ALTER COLUMN "competenciaFim" DROP DEFAULT;

-- Índice acompanha o novo nome da coluna
ALTER INDEX IF EXISTS "Envio_competencia_idx" RENAME TO "Envio_competenciaInicio_idx";

-- EnvioArquivo: em qual campo do formulário o anexo entrou.
-- Os anexos que existiam antes eram todos extrato bancário.
ALTER TABLE "EnvioArquivo" ADD COLUMN "categoria" TEXT NOT NULL DEFAULT 'bancario';
ALTER TABLE "EnvioArquivo" ALTER COLUMN "categoria" DROP DEFAULT;
