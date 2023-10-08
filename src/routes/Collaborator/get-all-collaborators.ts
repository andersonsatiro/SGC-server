import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function GetAllCollaborators(app: FastifyInstance) {
    app.get('/collaborators', { preHandler: app.authenticate }, async () => {
        const collaborators = await prisma.collaborator.findMany()
        return collaborators
    })
}