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

// src/routes/Leader/register-new-leader.ts
var register_new_leader_exports = {};
__export(register_new_leader_exports, {
  RegisterNewLeader: () => RegisterNewLeader
});
module.exports = __toCommonJS(register_new_leader_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/Leader/register-new-leader.ts
var import_zod = require("zod");
async function RegisterNewLeader(app) {
  app.post("/register/leader", { preHandler: app.authenticate }, async (req, reply) => {
    const leaderSchema = import_zod.z.object({
      name: import_zod.z.string(),
      jobId: import_zod.z.string().uuid()
    });
    const { name, jobId } = leaderSchema.parse(req.body);
    const leadershipPositions = await prisma.leadershipPositions.findFirstOrThrow({
      where: {
        id: jobId
      }
    });
    await prisma.leader.create({
      data: {
        name,
        jobRole: leadershipPositions.name,
        influence: leadershipPositions.influence
      }
    });
    return reply.status(201).send("Registered Leader");
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterNewLeader
});
