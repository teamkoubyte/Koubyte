import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import { z } from 'zod'
import crypto from 'crypto'

// Helper functie om te checken en aanmaken van ResetPasswordToken tabel
async function ensureResetPasswordTokenTable() {
  try {
    await prisma.$executeRaw`SELECT 1 FROM "ResetPasswordToken" LIMIT 1`
    return true // Tabel bestaat al
  } catch (error: any) {
    // Tabel bestaat niet, probeer aan te maken
    if (error.message?.includes('does not exist') || error.message?.includes('no such table')) {
      try {
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
        console.log('✅ ResetPasswordToken tabel automatisch aangemaakt')
        return true
      } catch (createError) {
        console.error('❌ Fout bij automatisch aanmaken tabel:', createError)
        return false
      }
    }
    throw error
  }
}

const requestSchema = z.object({
  email: z.string().email('Ongeldig emailadres'),
})

export async function POST(request: Request) {
  try {
    // Zorg ervoor dat ResetPasswordToken tabel bestaat
    const tableExists = await ensureResetPasswordTokenTable()
    if (!tableExists) {
      return NextResponse.json(
        { error: 'Database configuratie ontbreekt. Neem contact op met de beheerder.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    
    // Valideer input
    const validatedData = requestSchema.parse(body)

    // Zoek gebruiker
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    // Security: Laat niet weten of email bestaat (prevent user enumeration)
    if (!user) {
      // Return success message ook al bestaat gebruiker niet (security best practice)
      return NextResponse.json(
        { message: 'Als deze email bestaat, heb je een reset link ontvangen.' },
        { status: 200 }
      )
    }

    // Invalideer oude reset tokens voor deze gebruiker
    await prisma.resetPasswordToken.updateMany({
      where: {
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() } // Alleen nog geldige tokens
      },
      data: {
        used: true
      }
    })

    // Genereer secure random token (32 bytes = 64 hex characters)
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Sla reset token op (geldig voor 1 uur)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)
    
    await prisma.resetPasswordToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
        used: false,
      }
    })

    // Verstuur reset email
    try {
      await sendPasswordResetEmail(user.email, {
        name: user.name,
        resetToken,
      })
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError)
      // Verwijder token als email niet verzonden kon worden
      await prisma.resetPasswordToken.deleteMany({
        where: { userId: user.id, token: resetToken }
      })
      return NextResponse.json(
        { error: 'Kon reset email niet versturen' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Als deze email bestaat, heb je een reset link ontvangen.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    console.error('Error requesting password reset:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer het later opnieuw.' },
      { status: 500 }
    )
  }
}

