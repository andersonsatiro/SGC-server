import { fastify } from "fastify"
import { RegisterNewLeader } from "./routes/Leader/register-new-leader"
import { RegisterNewCollaborator } from "./routes/Collaborator/register-new-collaborator"
import { GetAllLeaders } from "./routes/Leader/get-all-leaders"
import { GetAllCollaborators } from "./routes/Collaborator/get-all-collaborators"
import { Auth } from './routes/User/auth'
import { SortLeadersByInfluence } from "./routes/Leader/sort-leaders-by-influence"
import { GetAllJobPositions } from "./routes/Positions/get-all-job-positions"
import { GetAllLeadershipPositions } from "./routes/Positions/get-all-leadership-positions"
import { CheckLeaderName } from "./routes/Leader/check-leader-name"
import { CheckCollaboratorName } from "./routes/Collaborator/check-collaborator-name"
import { RemoveCollaborators } from "./routes/Collaborator/remove-collaborators"
import { RemoveLeaders } from "./routes/Leader/remove-leaders"
import { CreateNewLeadershipPosition } from "./routes/Positions/create-new-leadership-position"
import { CreateNewJobPosition } from "./routes/Positions/create-new-job-position"
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
app.register(SortLeadersByInfluence)
app.register(GetAllJobPositions)
app.register(GetAllLeadershipPositions)
app.register(CheckLeaderName)
app.register(CheckCollaboratorName)
app.register(RemoveCollaborators)
app.register(RemoveLeaders)
app.register(CreateNewLeadershipPosition)
app.register(CreateNewJobPosition)

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log("HTTP Server Running!!")
})
