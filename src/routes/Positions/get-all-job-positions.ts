import fastify, { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function GetAllJobPositions(app: FastifyInstance) {
    app.get('/jobPositions', { preHandler: app.authenticate }, async () => {
        const jobs = await prisma.jobPositions.findMany()
        return jobs
    })
}