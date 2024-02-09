import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
const fastifyJWT = require('fastify-jwt');
const jwt = require('jsonwebtoken');

export function Auth(app: FastifyInstance, jwtSecret: String | undefined) {

    app.register(fastifyJWT, { secret: jwtSecret });

    app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
        try {
          await req.jwtVerify();
        } catch (err) {
          reply.status(401).send({ error: 'Token inválido ou expirado' });
        }
      });

    app.post('/login', async (req, reply) => {
        const userSchema = z.object({
            username: z.string(),
            password: z.string(),
        })

        try {
            const { username, password } = userSchema.parse(req.body)

            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    username
                }
            })

            if(!user) {
                return reply.status(401).send({ error: 'Usuário não encontrado'})              
            }

            if(user.password != password) {
                return reply.status(401).send({ error: 'Senha inválida'})
            }

            const token = jwt.sign({ username }, jwtSecret, { expiresIn: '5h' });

            reply.send({ token })
        
        } catch(error) {
            return reply.status(400).send({ error: 'Dados inválidos'})
        }
    })
}