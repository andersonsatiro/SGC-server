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

// src/routes/Positions/create-new-leadership-position.ts
var create_new_leadership_position_exports = {};
__export(create_new_leadership_position_exports, {
  CreateNewLeadershipPosition: () => CreateNewLeadershipPosition
});
module.exports = __toCommonJS(create_new_leadership_position_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/Positions/create-new-leadership-position.ts
async function CreateNewLeadershipPosition(app) {
  app.post("/leaders/novo-cargo", { preHandler: app.authenticate }, async (req, reply) => {
    const newLeadershipPositionSchema = import_zod.z.object({
      nameOfPosition: import_zod.z.string(),
      weightOfThePosition: import_zod.z.number()
    });
    const { nameOfPosition, weightOfThePosition } = newLeadershipPositionSchema.parse(req.body);
    try {
      const searchResponse = await prisma.leadershipPositions.findUnique({
        where: {
          name: nameOfPosition
        }
      });
      if (searchResponse) {
        return reply.status(201).send("j\xE1 existe um cargo com esse nome");
      }
      const additionAnswer = await prisma.leadershipPositions.create({
        data: {
          name: nameOfPosition,
          influence: weightOfThePosition
        }
      });
      if (!additionAnswer) {
        return reply.status(201).send("erro ao adicionar cargo");
      }
      return reply.status(201).send("cargo adicionado");
    } catch (error) {
      console.log("Erro: " + error);
      return reply.status(201).send("Erro. Tente novamente");
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateNewLeadershipPosition
});
