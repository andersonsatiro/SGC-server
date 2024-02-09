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

// src/routes/Collaborator/remove-collaborators.ts
var remove_collaborators_exports = {};
__export(remove_collaborators_exports, {
  RemoveCollaborators: () => RemoveCollaborators
});
module.exports = __toCommonJS(remove_collaborators_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/Collaborator/remove-collaborators.ts
async function RemoveCollaborators(app) {
  app.put("/remover/colaborador", { preHandler: app.authenticate }, async (req, reply) => {
    const collaboratorSchema = import_zod.z.object({
      ids: import_zod.z.array(import_zod.z.string().uuid())
    });
    const { ids } = collaboratorSchema.parse(req.body);
    const collaborators = await prisma.collaborator.findMany({
      where: {
        id: { in: ids }
      }
    });
    if (!collaborators) {
      return reply.status(201).send("colaborador n\xE3o encontrado");
    }
    await prisma.collaborator.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    collaborators.forEach(async (collaborator) => {
      const collaboratorsOfThisLeader = await prisma.collaborator.findMany({
        where: {
          leaderId: collaborator.leaderId
        }
      });
      if (collaboratorsOfThisLeader.length === 0) {
        await prisma.leader.update({
          where: {
            id: collaborator.leaderId
          },
          data: {
            monthlyIncome: 0,
            averageInfluence: 0,
            numberOfCollaborators: 0
          }
        });
        return reply.status(201).send("lista de colaboradores vazia");
      }
      const totalWeight = collaboratorsOfThisLeader.reduce((acc, currentCollaborator) => acc + currentCollaborator.influence, 0);
      const averageInfluence = totalWeight / collaboratorsOfThisLeader.length;
      await prisma.leader.update({
        where: {
          id: collaborator.leaderId
        },
        data: {
          monthlyIncome: {
            decrement: collaborator.salary
          },
          averageInfluence,
          numberOfCollaborators: {
            decrement: 1
          }
        }
      });
    });
    return reply.status(201).send("colaboradores removidos!");
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RemoveCollaborators
});
