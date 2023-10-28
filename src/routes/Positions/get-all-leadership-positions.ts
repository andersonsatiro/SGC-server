import fastify, { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function GetAllLeadershipPositions(app: FastifyInstance) {
    app.get('/leadershipPositions', { preHandler: app.authenticate }, async () => {
        const jobs = await prisma.leadershipPositions.findMany()
        return jobs
    })
}