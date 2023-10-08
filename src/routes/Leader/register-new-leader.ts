import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"
import { z } from 'zod'

export async function RegisterNewLeader(app: FastifyInstance){
    app.post('/register/leader', { preHandler: app.authenticate }, async (req, reply) => {

        const leaderSchema = z.object({
            name: z.string(),
            jobId: z.string().uuid(),
        })

        const { name, jobId } = leaderSchema.parse(req.body)

        const leadershipPositions = await prisma.leadershipPositions.findFirstOrThrow({
            where: {
                id: jobId
            }
        })

        await prisma.leader.create({
            data: {
                name,
                jobRole: leadershipPositions.name,
                influence: leadershipPositions.influence
            }
        })

        return reply.status(201).send('Registered Leader')
    })
}