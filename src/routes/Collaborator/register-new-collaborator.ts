import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify";
import { z } from 'zod'

interface Collaborator {
    id: string,
    name: string,
    jobRole: string,
    salary: number,
    influence: number,
    leaderId: string
}

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

        const collaborators = await prisma.collaborator.findMany({
            where: {
                leaderId: leader.id
            }
        })

        const filteredCollaborators = collaborators.filter(collaborator => collaborator.leaderId === leader.id);
        const totalWeight = filteredCollaborators.reduce((acc, collaborator) => acc + collaborator.influence, 0);
        
        if(leader) {
            await prisma.leader.update({
                where: {
                    id: leaderId
                },
                
                data: {
                    monthlyIncome: leader.monthlyIncome + salary,
                    numberOfCollaborators: leader.numberOfCollaborators + 1,
                    averageInfluence: totalWeight/filteredCollaborators.length
                }
            })
        }

        return reply.status(201).send('Registered Collaborator')
    })
} 