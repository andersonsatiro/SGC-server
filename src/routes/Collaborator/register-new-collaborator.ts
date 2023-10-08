import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify";
import { z } from 'zod'

export async function RegisterNewCollaborator(app: FastifyInstance) {
    app.post('/register/collaborator', { preHandler: app.authenticate }, async (req, reply) => {
        const collaboratorSchema = z.object({
            name: z.string(),
            salary: z.number(),
            jobId: z.string().uuid(),
            leaderId: z.string().uuid()
        })

        const { name, salary, jobId, leaderId } = collaboratorSchema.parse(req.body)

        const jobPositions = await prisma.jobPositions.findFirstOrThrow({
            where: {
                id: jobId
            }
        })
        
        const leader = await prisma.leader.findFirstOrThrow({
            where: {
                id: leaderId
            }
        })

        await prisma.collaborator.create({
            data: {
                name,
                jobRole: jobPositions.name,
                salary,
                influence: jobPositions.influence,
                leaderId,
            }
        })

        if(leader) {
            await prisma.leader.update({
                where: {
                    id: leaderId
                },
                
                data: {
                    monthlyIncome: leader.monthlyIncome + salary,
                    numberOfCollaborators: leader.numberOfCollaborators + 1
                }
            })
        }

        return reply.status(201).send('Registered Collaborator')
    })
}
  
