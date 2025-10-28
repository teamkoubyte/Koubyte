import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import { z } from 'zod'
import crypto from 'crypto'

// Sterke wachtwoord validatie
const passwordSchema = z.string()
  .min(8, 'Wachtwoord moet minimaal 8 tekens bevatten')
  .regex(/[A-Z]/, 'Wachtwoord moet minimaal 1 hoofdletter bevatten')
  .regex(/[a-z]/, 'Wachtwoord moet minimaal 1 kleine letter bevatten')
  .regex(/[0-9]/, 'Wachtwoord moet minimaal 1 cijfer bevatten')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Wachtwoord moet minimaal 1 speciaal teken bevatten')

// Valideer input
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: passwordSchema,
  phone: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Valideer data
    const validatedData = registerSchema.parse(body)

    // Check of email al bestaat
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is al geregistreerd' },
        { status: 400 }
      )
    }

    // Hash wachtwoord
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Maak gebruiker aan (emailVerified = false by default)
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
        emailVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    })

    // Genereer 6-cijferige verificatie code
    const verificationCode = crypto.randomInt(100000, 999999).toString()
    
    // Sla verificatie token op (geldig voor 15 minuten)
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
      // We gaan door, ook als email faalt - gebruiker kan later nieuwe code aanvragen
    }

    return NextResponse.json({ 
      success: true, 
      user,
      message: 'Account aangemaakt. Check je email voor de verificatiecode.'
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Geef specifieke wachtwoord validatie errors terug
      const passwordError = error.errors.find(e => e.path.includes('password'))
      if (passwordError) {
        return NextResponse.json(
          { error: passwordError.message },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Ongeldige gegevens' },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis bij het aanmaken van het account' },
      { status: 500 }
    )
  }
}

