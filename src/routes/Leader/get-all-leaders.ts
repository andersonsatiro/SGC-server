import fastify, { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { Authenticate } from '../../middleware/Authenticate'

export async function GetAllLeaders(app: FastifyInstance) {
    app.get('/leaders', { preHandler: app.authenticate }, async () => {
        const leaders = await prisma.leader.findMany({
          orderBy: {
            collaborators: {
              _count: 'desc',
            },
          },
        });
        return leaders;
      })
}