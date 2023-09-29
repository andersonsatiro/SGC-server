/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Leader` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `influence` to the `Leader` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Leader" ADD COLUMN     "influence" INTEGER NOT NULL,
ADD COLUMN     "monthlyIncome" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ALTER COLUMN "numberOfCollaborators" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "influence" INTEGER NOT NULL,
    "leaderId" TEXT NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobPositions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "influence" INTEGER NOT NULL,

    CONSTRAINT "jobPositions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadershipPositions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "influence" INTEGER NOT NULL,

    CONSTRAINT "LeadershipPositions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Leader_name_key" ON "Leader"("name");

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "Leader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
