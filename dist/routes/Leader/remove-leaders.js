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

// src/routes/Leader/remove-leaders.ts
var remove_leaders_exports = {};
__export(remove_leaders_exports, {
  RemoveLeaders: () => RemoveLeaders
});
module.exports = __toCommonJS(remove_leaders_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/Leader/remove-leaders.ts
async function RemoveLeaders(app) {
  app.put("/remover/lideranca", { preHandler: app.authenticate }, async (req, reply) => {
    const leaderSchema = import_zod.z.object({
      ids: import_zod.z.array(import_zod.z.string().uuid()),
      token: import_zod.z.string()
    });
    const { ids, token } = leaderSchema.parse(req.body);
    try {
      const leaders = await prisma.leader.findMany({
        where: {
          id: { in: ids }
        }
      });
      if (!leaders) {
        return reply.status(404).send("Lideran\xE7a n\xE3o encontrada!");
      }
      let collaboratorsIDs = [];
      let leadersIDs = [];
      for (const leader of leaders) {
        leadersIDs.push(leader.id);
        const collaborators = await prisma.collaborator.findMany({
          where: {
            leaderId: leader.id
          }
        });
        if (collaborators) {
          for (const collaborator of collaborators) {
            collaboratorsIDs.push(collaborator.id);
          }
        }
      }
      try {
        await prisma.collaborator.deleteMany({
          where: {
            id: { in: collaboratorsIDs }
          }
        });
      } catch (error) {
        console.error("Erro ao remover os colaboradores da lideran\xE7a", error);
        return reply.status(500).send("Erro ao remover os colaboradores da lideran\xE7a");
      }
      try {
        await prisma.leader.deleteMany({
          where: {
            id: { in: leadersIDs }
          }
        });
      } catch (error) {
        console.error("Erro ao remover lideran\xE7a ap\xF3s remover collaboradores", error);
        return reply.status(500).send("Erro ao remover lideran\xE7a ap\xF3s remover collaboradores");
      }
      return reply.status(201).send("Lideran\xE7as removidas com sucesso!");
    } catch (error) {
      console.error("Erro ao remover lideran\xE7as:", error);
      return reply.status(500).send("Erro ao remover lideran\xE7as");
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RemoveLeaders
});
