import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendContactEmail, sendAdminNotificationEmail } from '@/lib/email'
import { z } from 'zod'
import { createErrorResponse } from '@/lib/api-error'

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

    // Email versturen naar admin
    try {
      await sendContactEmail(validatedData)
      // Admin notification wordt al in sendContactEmail verstuurd, maar we sturen ook een aparte notification
      await sendAdminNotificationEmail('contact', {
        customerName: validatedData.name,
        customerEmail: validatedData.email,
        subject: validatedData.subject,
      })
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError)
    }

    return NextResponse.json(
      { success: true, message: 'Bericht verzonden!' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(error, 'Ongeldige gegevens', 400)
    }

    return createErrorResponse(error, 'Fout bij versturen contact bericht', 500)
  }
}
