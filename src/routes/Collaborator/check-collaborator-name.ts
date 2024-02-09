import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function CheckCollaboratorName(app: FastifyInstance) {
    app.get('/collaborator/:name', { preHandler: app.authenticate }, async (req) => {

        const paramsSchema = z.object({
            name: z.string(),
        })
        const { name } = paramsSchema.parse(req.params)

        try {
            const collaboratorExist = await prisma.collaborator.findFirstOrThrow({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive',
                    }
                }
            })
            return collaboratorExist ? true : false

        } catch(error){
            return false
        }

    })
}
