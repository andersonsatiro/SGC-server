/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Collaborator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `JobPositions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `LeadershipPositions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_name_key" ON "Collaborator"("name");

-- CreateIndex
CREATE UNIQUE INDEX "JobPositions_name_key" ON "JobPositions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LeadershipPositions_name_key" ON "LeadershipPositions"("name");
