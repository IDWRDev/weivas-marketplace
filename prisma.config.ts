import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  // Prisma generation does not connect to the database. This placeholder lets a
  // clean npm install generate the client before local environment setup.
  datasource: { url: process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/weivas" },
});
