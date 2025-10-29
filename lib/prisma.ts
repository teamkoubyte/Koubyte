import { PrismaClient } from '@prisma/client'

// Singleton pattern voor Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Foreign key constraints zijn automatisch enabled in PostgreSQL
// Geen PRAGMA nodig (dat is alleen voor SQLite)

