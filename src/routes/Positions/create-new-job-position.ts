import { FastifyInstance } from "fastify/types/instance";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function CreateNewJobPosition(app: FastifyInstance){
  app.post('/collaborators/novo-cargo', { preHandler: app.authenticate }, async (req, reply) => {
      const newJobPositionSchema = z.object({
        nameOfPosition: z.string(),
        weightOfThePosition: z.number()
      });

      const { nameOfPosition, weightOfThePosition } = newJobPositionSchema.parse(req.body);
      try {
        const searchResponse = await prisma.jobPositions.findUnique({
          where: {
            name: nameOfPosition
          }
        });

        if (searchResponse) {
          return reply.status(201).send("já existe um cargo com esse nome")
        }

        const additionAnswer = await prisma.jobPositions.create({
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