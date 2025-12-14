import { PrismaClient } from "../../prisma/generated/client/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

// Create connection pool
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Create adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with adapter
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
