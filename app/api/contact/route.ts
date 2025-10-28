import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // Sla bericht op in database
    const contactMessage = await prisma.contactMessage.create({
      data: validatedData,
    })

    // Email versturen (optioneel, als geconfigureerd)
    try {
      // await sendContactEmail(validatedData)
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError)
    }

    return NextResponse.json(
      { success: true, message: 'Bericht verzonden!' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ongeldige gegevens' },
        { status: 400 }
      )
    }

    console.error('Contact error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis' },
      { status: 500 }
    )
  }
}
