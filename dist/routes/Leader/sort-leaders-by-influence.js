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

// src/routes/Leader/sort-leaders-by-influence.ts
var sort_leaders_by_influence_exports = {};
__export(sort_leaders_by_influence_exports, {
  SortLeadersByInfluence: () => SortLeadersByInfluence
});
module.exports = __toCommonJS(sort_leaders_by_influence_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/routes/Leader/sort-leaders-by-influence.ts
async function SortLeadersByInfluence(app) {
  app.get("/leaders/influence", { preHandler: app.authenticate }, async () => {
    const leaders = await prisma.leader.findMany({
      orderBy: {
        averageInfluence: "desc"
      }
    });
    return leaders;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SortLeadersByInfluence
});
