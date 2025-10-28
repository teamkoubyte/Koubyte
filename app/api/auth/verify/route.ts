import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6).regex(/^\d+$/, 'Code moet 6 cijfers zijn'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Valideer input
    const validatedData = verifySchema.parse(body)

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

    // Zoek geldige verificatie token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        userId: user.id,
        token: validatedData.code,
        used: false,
        expiresAt: {
          gt: new Date() // Token moet nog niet verlopen zijn
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Ongeldige of verlopen verificatiecode' },
        { status: 400 }
      )
    }

    // Markeer token als gebruikt
    await prisma.verificationToken.update({
      where: { id: verificationToken.id },
      data: { used: true }
    })

    // Update gebruiker als geverifieerd
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifiedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Email succesvol geverifieerd'
    }, { status: 200 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ongeldige gegevens' },
        { status: 400 }
      )
    }

    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij de verificatie' },
      { status: 500 }
    )
  }
}

