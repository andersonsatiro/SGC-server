import fastify, { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import axios from 'axios';

interface Leader {
  id: string,
  name: string,
  jobRole: string,
  numberOfCollaborators: number,
  monthlyIncome: number,
  averageInfluence: number,
  influence: number,
}

interface Collaborator {
  id: string,
  name: string,
  jobRole: string,
  salary: number,
  influence: number,
  leaderName: string,
  leaderId: string,
}

export async function RemoveLeaders(app: FastifyInstance){
  app.put('/remover/lideranca', { preHandler: app.authenticate }, async (req, reply) => {
    const leaderSchema = z.object({
      ids: z.array(z.string().uuid()),
      token: z.string()
    })

    const { ids, token } = leaderSchema.parse(req.body)

    try{
     
      const leaders: Leader[] | null = await prisma.leader.findMany({
        where:{
          id: {in: ids}
        }
      })

      if(!leaders){
        return reply.status(404).send('Liderança não encontrada!')
      }

      let collaboratorsIDs = []
      let leadersIDs = []

      for(const leader of leaders){
        leadersIDs.push(leader.id)

        const collaborators: Collaborator[] | null = await prisma.collaborator.findMany({
          where:{
            leaderId: leader.id
          }
        })

        if(collaborators){
          for(const collaborator of collaborators){
            collaboratorsIDs.push(collaborator.id)
          }
        }
      }

      try{
        await prisma.collaborator.deleteMany({
          where: {
            id: {in: collaboratorsIDs}
          }
        })
      }catch(error){
        console.error('Erro ao remover os colaboradores da liderança', error)
        return reply.status(500).send('Erro ao remover os colaboradores da liderança')
      }

      try{
        await prisma.leader.deleteMany({
          where: {
            id: {in: leadersIDs}
          }
        })
      }catch(error){
        console.error('Erro ao remover liderança após remover collaboradores', error)
        return reply.status(500).send('Erro ao remover liderança após remover collaboradores')
      }
      
      return reply.status(201).send('Lideranças removidas com sucesso!')

    } catch (error) {
      console.error('Erro ao remover lideranças:', error)
      return reply.status(500).send('Erro ao remover lideranças')
    }  
  })
}