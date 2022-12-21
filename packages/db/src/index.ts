import { PrismaClient } from "@prisma/client";

const dev = process.env.NODE_ENV !== "production";

export function getClient() {
  return new PrismaClient({
    errorFormat: "pretty",
    log: dev === true ? ["error", "info", "query", "warn"] : ["error", "info"],
  });
}

export * from "@prisma/client";
