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

// src/routes/Leader/check-leader-name.ts
var check_leader_name_exports = {};
__export(check_leader_name_exports, {
  CheckLeaderName: () => CheckLeaderName
});
module.exports = __toCommonJS(check_leader_name_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/Leader/check-leader-name.ts
async function CheckLeaderName(app) {
  app.get("/leader/:name", { preHandler: app.authenticate }, async (req) => {
    const paramsSchema = import_zod.z.object({
      name: import_zod.z.string()
    });
    const { name } = paramsSchema.parse(req.params);
    try {
      const leaderExist = await prisma.leader.findFirstOrThrow({
        where: {
          name: {
            equals: name,
            mode: "insensitive"
          }
        }
      });
      return leaderExist ? true : false;
    } catch (error) {
      return false;
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CheckLeaderName
});
