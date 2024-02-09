"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/Collaborator/register-new-collaborator.ts
var register_new_collaborator_exports = {};
__export(register_new_collaborator_exports, {
  RegisterNewCollaborator: () => RegisterNewCollaborator
});
module.exports = __toCommonJS(register_new_collaborator_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/Collaborator/register-new-collaborator.ts
var import_zod = require("zod");
async function RegisterNewCollaborator(app) {
  app.post("/register/collaborator", { preHandler: app.authenticate }, async (req, reply) => {
    const collaboratorSchema = import_zod.z.object({
      name: import_zod.z.string(),
      salary: import_zod.z.number(),
      jobId: import_zod.z.string().uuid(),
      leaderId: import_zod.z.string().uuid(),
      influence: import_zod.z.number()
    });
    const { name, salary, jobId, leaderId, influence } = collaboratorSchema.parse(req.body);
    const jobPositions = await prisma.jobPositions.findFirstOrThrow({
      where: {
        id: jobId
      }
    });
    let influenceValue;
    if (influence >= 1 && influence <= 5) {
      influenceValue = influence;
    } else {
      influenceValue = jobPositions.influence;
    }
    const leader = await prisma.leader.findFirstOrThrow({
      where: {
        id: leaderId
      }
    });
    await prisma.collaborator.create({
      data: {
        name,
        jobRole: jobPositions.name,
        salary,
        influence: influenceValue,
        leaderName: leader.name,
        leaderId
      }
    });
    const collaborators = await prisma.collaborator.findMany({
      where: {
        leaderId: leader.id
      }
    });
    const filteredCollaborators = collaborators.filter((collaborator) => collaborator.leaderId === leader.id);
    const totalWeight = filteredCollaborators.reduce((acc, collaborator) => acc + collaborator.influence, 0);
    if (leader) {
      await prisma.leader.update({
        where: {
          id: leaderId
        },
        data: {
          monthlyIncome: leader.monthlyIncome + salary,
          numberOfCollaborators: leader.numberOfCollaborators + 1,
          averageInfluence: totalWeight / filteredCollaborators.length
        }
      });
    }
    return reply.status(201).send("Registered Collaborator");
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterNewCollaborator
});
