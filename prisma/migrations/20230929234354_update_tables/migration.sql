-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Leader" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobRole" TEXT NOT NULL,
    "numberOfCollaborators" INTEGER NOT NULL DEFAULT 0,
    "monthlyIncome" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "influence" INTEGER NOT NULL,

    CONSTRAINT "Leader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobRole" TEXT NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "influence" INTEGER NOT NULL,
    "leaderId" TEXT NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPositions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "influence" INTEGER NOT NULL,

    CONSTRAINT "JobPositions_pkey" PRIMARY KEY ("id")
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
