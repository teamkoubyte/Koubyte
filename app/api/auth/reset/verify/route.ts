import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const resetSchema = z.object({
  token: z.string().min(1, 'Token is verplicht'),
  password: z.string()
    .min(8, 'Wachtwoord moet minimaal 8 tekens lang zijn')
    .regex(/[A-Z]/, 'Wachtwoord moet minimaal één hoofdletter bevatten')
    .regex(/[a-z]/, 'Wachtwoord moet minimaal één kleine letter bevatten')
    .regex(/[0-9]/, 'Wachtwoord moet minimaal één cijfer bevatten'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Valideer input
    const validatedData = resetSchema.parse(body)

    // Zoek reset token
    const resetToken = await prisma.resetPasswordToken.findUnique({
      where: { token: validatedData.token },
      include: { user: true }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Ongeldige of verlopen reset link' },
        { status: 400 }
      )
    }

    // Check of token gebruikt is
    if (resetToken.used) {
      return NextResponse.json(
        { error: 'Deze reset link is al gebruikt' },
        { status: 400 }
      )
    }

    // Check of token verlopen is
    if (resetToken.expiresAt < new Date()) {
      // Markeer token als gebruikt
      await prisma.resetPasswordToken.update({
        where: { id: resetToken.id },
        data: { used: true }
      })
      return NextResponse.json(
        { error: 'Deze reset link is verlopen. Vraag een nieuwe aan.' },
        { status: 400 }
      )
    }

    // Hash nieuw wachtwoord
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Update wachtwoord en markeer token als gebruikt (in een transaction)
    await prisma.$transaction([
      // Update wachtwoord
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword }
      }),
      // Markeer token als gebruikt
      prisma.resetPasswordToken.update({
        where: { id: resetToken.id },
        data: { used: true }
      }),
      // Invalideer alle andere actieve reset tokens voor deze gebruiker
      prisma.resetPasswordToken.updateMany({
        where: {
          userId: resetToken.userId,
          used: false,
          id: { not: resetToken.id }
        },
        data: { used: true }
      })
    ])

    return NextResponse.json(
      { message: 'Wachtwoord succesvol gereset. Je kunt nu inloggen met je nieuwe wachtwoord.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis. Probeer het later opnieuw.' },
      { status: 500 }
    )
  }
}

