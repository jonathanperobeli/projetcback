/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Festa` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Pessoa` table. All the data in the column will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Festa" DROP CONSTRAINT "Festa_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Pessoa" DROP CONSTRAINT "Pessoa_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Festa" DROP COLUMN "usuarioId";

-- AlterTable
ALTER TABLE "Pessoa" DROP COLUMN "usuarioId";

-- DropTable
DROP TABLE "Usuario";
