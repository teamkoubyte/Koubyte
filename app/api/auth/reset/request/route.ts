import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import { z } from 'zod'
import crypto from 'crypto'

const requestSchema = z.object({
  email: z.string().email('Ongeldig emailadres'),
})

export async function POST(request: Request) {
  try {
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

