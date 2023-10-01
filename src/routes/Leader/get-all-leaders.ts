import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function GetAllLeaders(app: FastifyInstance) {
    /*app.get('/leaders', async () => {
        const leaders = await prisma.leader.findMany()
        return leaders
    })*/

    app.get('/leaders', async () => {
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