/*
  Warnings:

  - Added the required column `usuarioId` to the `Pessoa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pessoaId` to the `Presente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pessoa" ADD COLUMN     "festaId" INTEGER,
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Presente" ADD COLUMN     "pessoaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Festa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Festa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_festaId_fkey" FOREIGN KEY ("festaId") REFERENCES "Festa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presente" ADD CONSTRAINT "Presente_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Festa" ADD CONSTRAINT "Festa_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
