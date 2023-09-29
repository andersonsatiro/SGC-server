import { fastify } from "fastify"
import { prisma } from "./lib/prisma"
import { RegisterNewLeader } from "./routes/register-new-leader"

const app = fastify()

app.register(RegisterNewLeader)


app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log("HTTP Server Running!!")
})