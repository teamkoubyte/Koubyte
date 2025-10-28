import { PrismaClient } from '@prisma/client'

// Singleton pattern voor Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Enable foreign key constraints for SQLite
// Dit moet ELKE keer bij connectie worden aangezet voor SQLite
prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;').catch((e) => {
  console.error('Failed to enable foreign keys:', e)
})

