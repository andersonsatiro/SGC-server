import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { z } from 'zod'

export async function RegisterNewLeader(app: FastifyInstance){
    app.post('/registerLeader', async (req, reply) => {
        const leaderSchema = z.object({
            name: z.string(),
            influence: z.number(),
        })
        const { name, influence } = leaderSchema.parse(req.body)

        await prisma.leader.create({
            data: {
                name,
                influence,
            }
        })
        return reply.status(201).send("Registered leader")
    })
}