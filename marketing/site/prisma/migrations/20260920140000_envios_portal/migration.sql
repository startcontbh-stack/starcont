-- CreateTable
CREATE TABLE "Envio" (
    "id" TEXT NOT NULL,
    "nomeCliente" TEXT NOT NULL,
    "empresa" TEXT,
    "telefone" TEXT,
    "competencia" TEXT NOT NULL,
    "faturamentoCentavos" INTEGER,
    "semMovimento" BOOLEAN NOT NULL DEFAULT false,
    "observacoes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'recebido',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Envio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvioArquivo" (
    "id" TEXT NOT NULL,
    "envioId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvioArquivo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Envio_competencia_idx" ON "Envio"("competencia");

-- CreateIndex
CREATE INDEX "Envio_createdAt_idx" ON "Envio"("createdAt");

-- CreateIndex
CREATE INDEX "EnvioArquivo_envioId_idx" ON "EnvioArquivo"("envioId");

-- AddForeignKey
ALTER TABLE "EnvioArquivo" ADD CONSTRAINT "EnvioArquivo_envioId_fkey" FOREIGN KEY ("envioId") REFERENCES "Envio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
