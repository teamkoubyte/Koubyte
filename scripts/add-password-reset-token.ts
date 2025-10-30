import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Voegt ResetPasswordToken tabel toe...')

  try {
    // Check of tabel al bestaat
    const tableExists = await prisma.$queryRaw<Array<{ name: string }>>`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='ResetPasswordToken'
    `.catch(() => [])

    if (tableExists.length > 0) {
      console.log('✅ ResetPasswordToken tabel bestaat al!')
      return
    }

    // Voer SQL migration uit
    await prisma.$executeRaw`
      CREATE TABLE "ResetPasswordToken" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expiresAt" DATETIME NOT NULL,
        "used" BOOLEAN NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ResetPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `

    await prisma.$executeRaw`
      CREATE UNIQUE INDEX "ResetPasswordToken_token_key" ON "ResetPasswordToken"("token")
    `

    await prisma.$executeRaw`
      CREATE INDEX "ResetPasswordToken_userId_idx" ON "ResetPasswordToken"("userId")
    `

    await prisma.$executeRaw`
      CREATE INDEX "ResetPasswordToken_token_idx" ON "ResetPasswordToken"("token")
    `

    await prisma.$executeRaw`
      CREATE INDEX "ResetPasswordToken_expiresAt_idx" ON "ResetPasswordToken"("expiresAt")
    `

    console.log('✅ ResetPasswordToken tabel succesvol aangemaakt!')
    console.log('✅ Alle indexes succesvol aangemaakt!')
  } catch (error: any) {
    // PostgreSQL fallback
    if (error.message?.includes('syntax error') || error.message?.includes('does not exist')) {
      console.log('🔄 Probeert PostgreSQL syntax...')
      
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "ResetPasswordToken" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "token" TEXT NOT NULL,
          "expiresAt" TIMESTAMP NOT NULL,
          "used" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "ResetPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `

      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "ResetPasswordToken_token_key" ON "ResetPasswordToken"("token")
      `

      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "ResetPasswordToken_userId_idx" ON "ResetPasswordToken"("userId")
      `

      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "ResetPasswordToken_token_idx" ON "ResetPasswordToken"("token")
      `

      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "ResetPasswordToken_expiresAt_idx" ON "ResetPasswordToken"("expiresAt")
      `

      console.log('✅ ResetPasswordToken tabel succesvol aangemaakt (PostgreSQL)!')
    } else {
      console.error('❌ Fout bij aanmaken tabel:', error)
      throw error
    }
  }
}

main()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

