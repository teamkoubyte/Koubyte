import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import { z } from 'zod'
import crypto from 'crypto'

const resendSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Valideer input
    const validatedData = resendSchema.parse(body)

    // Zoek gebruiker
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Gebruiker niet gevonden' },
        { status: 404 }
      )
    }

    // Check of al geverifieerd
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is al geverifieerd' },
        { status: 400 }
      )
    }

    // Invalideer oude tokens voor deze gebruiker
    await prisma.verificationToken.updateMany({
      where: {
        userId: user.id,
        used: false
      },
      data: {
        used: true
      }
    })

    // Genereer nieuwe 6-cijferige verificatie code
    const verificationCode = crypto.randomInt(100000, 999999).toString()
    
    // Sla nieuwe verificatie token op (geldig voor 15 minuten)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)
    
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: verificationCode,
        expiresAt,
        used: false,
      }
    })

    // Verstuur verificatie email
    try {
      await sendVerificationEmail(user.email, {
        name: user.name,
        verificationCode,
      })
    } catch (emailError) {
      console.error('Error sending verification email:', emailError)
      return NextResponse.json(
        { error: 'Kon verificatie email niet versturen' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Een nieuwe verificatiecode is verstuurd naar je email'
    }, { status: 200 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ongeldige gegevens' },
        { status: 400 }
      )
    }

    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij het versturen van een nieuwe code' },
      { status: 500 }
    )
  }
}

