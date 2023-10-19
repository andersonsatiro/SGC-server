/*
  Warnings:

  - You are about to drop the column `averageWeight` on the `Leader` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Leader" DROP COLUMN "averageWeight",
ADD COLUMN     "averageInfluence" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
