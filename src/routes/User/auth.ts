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

    app.post('/login', { preHandler: app.authenticate }, async (req, reply) => {
        const userSchema = z.object({
            username: z.string().uuid(),
            password: z.string().uuid(),
        })

        try {
            const { username, password } = userSchema.parse(req.body)

            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    username
                }
            })

            if(!user) {
                reply.status(401).send({ error: 'Usuário não encontrado'})
                return
            }

            if(user.password != password) {
                reply.status(401).send({ error: 'Senha inválida'})
                return
            }

            const token = jwt.sign({ username }, jwtSecret, { expiresIn: '5h' });

            reply.send({ token })
        
        } catch(error) {
            reply.status(400).send({ error: 'Dados inválidos'})
        }
    })
}




/*import fastify, { FastifyInstance } from "fastify"
import { z } from 'zod'
import { prisma } from "../../lib/prisma"
const jwt = require('jsonwebtoken');
import {Authenticate} from '../../middleware/Authenticate'

const jwtSecret = process.env.JWT_SECRET

export async function CheckUser(app: FastifyInstance){
    app.post('/login', { preHandler: fastify.Authenticate }, async (req, reply) => {
        const userSchema = z.object({
            username: z.string().uuid(),
            password: z.string().uuid(),
        })

        try {
            const { username, password } = userSchema.parse(req.body)

            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    username
                }
            })

            if(!user) {
                reply.status(401).send({ error: 'Usuário não encontrado'})
                return
            }

            if(user.password != password) {
                reply.status(401).send({ error: 'Senha inválida'})
                return
            }

            const token = jwt.sign({ username }, jwtSecret, { expiresIn: '5h' });

            reply.send({ token })
        
        } catch(error) {
            reply.status(400).send({ error: 'Dados inválidos'})
        }
    })
}*/