import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function GetAllCollaborators(app: FastifyInstance) {
    app.get('/collaborators', async () => {
        const collaborators = await prisma.collaborator.findMany()
        return collaborators
    })
}