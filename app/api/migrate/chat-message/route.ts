import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createErrorResponse } from '@/lib/api-error'

// POST - Maak ChatMessage tabel aan als deze niet bestaat
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    // Alleen admin kan migratie uitvoeren
    if (!session || session.user.role !== 'admin') {
      return createErrorResponse(null, 'Geen toegang', 403)
    }

    // Probeer een simpele query uit te voeren om te kijken of de tabel bestaat
    try {
      await prisma.$queryRaw`SELECT 1 FROM "ChatMessage" LIMIT 1`
      return NextResponse.json({ 
        message: 'ChatMessage tabel bestaat al',
        tableExists: true 
      }, { status: 200 })
    } catch (error: any) {
      // Als de tabel niet bestaat, maak deze aan
      if (error.code === 'P2021' || error.message?.includes('does not exist')) {
        // Maak de tabel aan
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "ChatMessage" (
            "id" TEXT NOT NULL,
            "conversationId" TEXT NOT NULL,
            "userId" TEXT,
            "senderName" TEXT,
            "senderEmail" TEXT,
            "message" TEXT NOT NULL,
            "senderType" TEXT NOT NULL DEFAULT 'client',
            "read" BOOLEAN NOT NULL DEFAULT false,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
          );
        `)

        // Maak indexes aan
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "ChatMessage_conversationId_idx" ON "ChatMessage"("conversationId");
          CREATE INDEX IF NOT EXISTS "ChatMessage_userId_idx" ON "ChatMessage"("userId");
          CREATE INDEX IF NOT EXISTS "ChatMessage_createdAt_idx" ON "ChatMessage"("createdAt");
        `)

        // Maak foreign key aan (als deze nog niet bestaat)
        try {
          await prisma.$executeRawUnsafe(`
            ALTER TABLE "ChatMessage" 
            ADD CONSTRAINT "ChatMessage_userId_fkey" 
            FOREIGN KEY ("userId") 
            REFERENCES "User"("id") 
            ON DELETE SET NULL 
            ON UPDATE CASCADE;
          `)
        } catch (fkError: any) {
          // Foreign key bestaat mogelijk al, dat is OK
          if (!fkError.message?.includes('already exists')) {
            throw fkError
          }
        }

        return NextResponse.json({ 
          message: 'ChatMessage tabel succesvol aangemaakt',
          tableExists: false,
          created: true 
        }, { status: 201 })
      } else {
        throw error
      }
    }
  } catch (error) {
    return createErrorResponse(error, 'Fout bij aanmaken ChatMessage tabel', 500)
  }
}

// GET - Check of ChatMessage tabel bestaat
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Alleen admin kan checken
    if (!session || session.user.role !== 'admin') {
      return createErrorResponse(null, 'Geen toegang', 403)
    }

    try {
      await prisma.$queryRaw`SELECT 1 FROM "ChatMessage" LIMIT 1`
      return NextResponse.json({ 
        tableExists: true,
        message: 'ChatMessage tabel bestaat' 
      }, { status: 200 })
    } catch (error: any) {
      if (error.code === 'P2021' || error.message?.includes('does not exist')) {
        return NextResponse.json({ 
          tableExists: false,
          message: 'ChatMessage tabel bestaat niet' 
        }, { status: 200 })
      }
      throw error
    }
  } catch (error) {
    return createErrorResponse(error, 'Fout bij controleren ChatMessage tabel', 500)
  }
}

