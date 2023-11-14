import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function CheckLeaderName(app: FastifyInstance) {
    app.get('/leader/:name', { preHandler: app.authenticate }, async (req) => {

        const paramsSchema = z.object({
            name: z.string(),
        })
        const { name } = paramsSchema.parse(req.params)

        try {
            const leaderExist = await prisma.leader.findFirstOrThrow({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive',
                    }
                }
            })
            return leaderExist ? true : false

        } catch(error){
            return false
        }

    })
}
