import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🔄 Voegt ResetPasswordToken tabel toe...')

    // Check of tabel al bestaat (voor PostgreSQL)
    try {
      await prisma.$executeRaw`
        SELECT 1 FROM "ResetPasswordToken" LIMIT 1
      `
      return NextResponse.json(
        { message: 'ResetPasswordToken tabel bestaat al!' },
        { status: 200 }
      )
    } catch (error: any) {
      // Tabel bestaat nog niet, ga verder
      if (!error.message?.includes('does not exist') && !error.message?.includes('no such table')) {
        throw error
      }
    }

    // Probeer SQLite syntax eerst
    try {
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

      return NextResponse.json(
        { message: '✅ ResetPasswordToken tabel succesvol aangemaakt (SQLite)!' },
        { status: 200 }
      )
    } catch (sqliteError: any) {
      // Probeer PostgreSQL syntax
      if (sqliteError.message?.includes('syntax error') || sqliteError.message?.includes('near "DATETIME"')) {
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

        return NextResponse.json(
          { message: '✅ ResetPasswordToken tabel succesvol aangemaakt (PostgreSQL)!' },
          { status: 200 }
        )
      }
      throw sqliteError
    }
  } catch (error: any) {
    console.error('❌ Fout bij aanmaken tabel:', error)
    return NextResponse.json(
      {
        error: 'Fout bij aanmaken tabel',
        details: error.message || 'Onbekende fout',
      },
      { status: 500 }
    )
  }
}

