import { FastifyInstance } from "fastify/types/instance";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function CreateNewLeadershipPosition(app: FastifyInstance){
  app.post('/leaders/novo-cargo', { preHandler: app.authenticate }, async (req, reply) => {
      const newLeadershipPositionSchema = z.object({
        nameOfPosition: z.string(),
        weightOfThePosition: z.number()
      });

      const { nameOfPosition, weightOfThePosition } = newLeadershipPositionSchema.parse(req.body);
      try {
        const searchResponse = await prisma.leadershipPositions.findUnique({
          where: {
            name: nameOfPosition
          }
        });

        if (searchResponse) {
          return reply.status(201).send("já existe um cargo com esse nome")
        }

        const additionAnswer = await prisma.leadershipPositions.create({
          data: {
            name: nameOfPosition,
            influence: weightOfThePosition
          }
        });

        if (!additionAnswer) {
          return reply.status(201).send('erro ao adicionar cargo');
        }

        return reply.status(201).send('cargo adicionado');

      } catch (error) {
        console.log("Erro: " + error);
        return reply.status(201).send('Erro. Tente novamente');
      }
    })
}