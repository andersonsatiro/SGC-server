import { fastify } from "fastify"
import { prisma } from "./lib/prisma"

const app = fastify()

app.get('/', async () => {
    const leaders = await prisma.leader.findMany()
    return leaders
})

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log("HTTP Server Running!")
})