import { fastify } from "fastify"
import { RegisterNewLeader } from "./routes/Leader/register-new-leader"
import { RegisterNewCollaborator } from "./routes/Collaborator/register-new-collaborator"
import { GetAllLeaders } from "./routes/Leader/get-all-leaders"
import { GetAllCollaborators } from "./routes/Collaborator/get-all-collaborators"
import { Auth } from './routes/User/auth'
const fastifyCors = require('fastify-cors');

const jwtSecret = process.env.JWT_SECRET
const app = fastify()
Auth(app, jwtSecret)


app.register(fastifyCors, {
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization', 
    credentials: true,
})

app.register(RegisterNewLeader)
app.register(RegisterNewCollaborator)
app.register(GetAllLeaders)
app.register(GetAllCollaborators)

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log("HTTP Server Running!!")
})
