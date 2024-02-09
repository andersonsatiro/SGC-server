import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { prisma } from "../../lib/prisma";

interface Collaborator {
    id: string,
    name: string,
    jobRole: string,
    salary: number,
    influence: number,
    leaderName: string,
    leaderId: string,
}

export async function RemoveCollaborators(app: FastifyInstance) {
    app.put('/remover/colaborador', { preHandler: app.authenticate }, async (req, reply) => {

        const collaboratorSchema = z.object({
            ids: z.array(z.string().uuid())
        })

        const { ids } = collaboratorSchema.parse(req.body)

        const collaborators: Collaborator[] | null = await prisma.collaborator.findMany({
            where: {
              id: { in: ids }
            }
        })
          
        if(!collaborators){
            return reply.status(201).send('colaborador não encontrado')
        }

        await prisma.collaborator.deleteMany({
            where: {
              id: { in: ids }
            }
        })

        collaborators.forEach( async (collaborator) => {
            const collaboratorsOfThisLeader = await prisma.collaborator.findMany({
                where: {
                    leaderId: collaborator.leaderId
                }                   
            })

            if(collaboratorsOfThisLeader.length === 0){
                await prisma.leader.update({
                    where: {
                        id: collaborator.leaderId
                    },
                    data: {
                        monthlyIncome: 0,
                        averageInfluence: 0,
                        numberOfCollaborators: 0,
                    },
                });
                return reply.status(201).send('lista de colaboradores vazia')
            }

            const totalWeight = collaboratorsOfThisLeader.reduce((acc, currentCollaborator) => acc + currentCollaborator.influence, 0);
            const averageInfluence =  totalWeight/collaboratorsOfThisLeader.length  
            
            await prisma.leader.update({
                where: {
                    id: collaborator.leaderId
                },
                data: {
                    monthlyIncome: {
                        decrement: collaborator.salary
                    },
                    averageInfluence,
                    numberOfCollaborators: {
                        decrement: 1
                    }
                },
            });
        }) 
        return reply.status(201).send('colaboradores removidos!')
    })
}