import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function CheckLeaderName(app: FastifyInstance) {
    app.get('/leader/:name', async (req) => {

        const paramsSchema = z.object({
            name: z.string(),
        })
        const { name } = paramsSchema.parse(req.params)

        try {
            const leaderExist = await prisma.leader.findFirstOrThrow({
                where: {
                    name,
                }
            })

            return leaderExist.name
        } catch(error){
            return null
        }

    })
}
