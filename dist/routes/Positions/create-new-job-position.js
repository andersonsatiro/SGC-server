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

// src/routes/Positions/create-new-job-position.ts
var create_new_job_position_exports = {};
__export(create_new_job_position_exports, {
  CreateNewJobPosition: () => CreateNewJobPosition
});
module.exports = __toCommonJS(create_new_job_position_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/Positions/create-new-job-position.ts
async function CreateNewJobPosition(app) {
  app.post("/collaborators/novo-cargo", { preHandler: app.authenticate }, async (req, reply) => {
    const newJobPositionSchema = import_zod.z.object({
      nameOfPosition: import_zod.z.string(),
      weightOfThePosition: import_zod.z.number()
    });
    const { nameOfPosition, weightOfThePosition } = newJobPositionSchema.parse(req.body);
    try {
      const searchResponse = await prisma.jobPositions.findUnique({
        where: {
          name: nameOfPosition
        }
      });
      if (searchResponse) {
        return reply.status(201).send("j\xE1 existe um cargo com esse nome");
      }
      const additionAnswer = await prisma.jobPositions.create({
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
  CreateNewJobPosition
});
