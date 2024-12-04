-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "foto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pessoa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "idade" TIMESTAMP(3) NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "foto" TEXT,
    "presente" BOOLEAN NOT NULL,
    "convidada" BOOLEAN NOT NULL,
    "anfitriao" BOOLEAN NOT NULL,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "foto" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Presente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usuario_key" ON "Usuario"("usuario");
