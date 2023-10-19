import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"

export async function SortLeadersByInfluence(app: FastifyInstance) {
    app.get('/influence', { preHandler: app.authenticate }, async () => {
        const leaders = await prisma.leader.findMany({
            orderBy: {
                averageInfluence: 'desc'
            }
        })

        return leaders
    })
}



