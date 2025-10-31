import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createErrorResponse } from '@/lib/api-error'

// Schema voor chat message validatie
const chatMessageSchema = z.object({
  conversationId: z.string().min(1),
  message: z.string().min(1).max(2000),
  senderName: z.string().optional(),
  senderEmail: z.string().email().optional(),
})

// GET - Haal chat messages op voor een conversatie
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId || conversationId.trim() === '') {
      return createErrorResponse(null, 'conversationId is verplicht', 400)
    }

    const session = await getServerSession(authOptions)

    // SECURITY: Valideer toegang tot conversatie
    if (session?.user?.role === 'admin') {
      // Admins kunnen alle conversaties zien
    } else if (session?.user) {
      // Ingelogde gebruiker: conversationId moet overeenkomen met user email of userId
      // Check of deze conversatie bij deze gebruiker hoort
      const userConversation = await prisma.chatMessage.findFirst({
        where: {
          conversationId,
          OR: [
            { userId: session.user.id },
            { conversationId: session.user.email },
          ],
        },
        select: { id: true },
      })

      if (!userConversation) {
        // Check of conversationId de email is van de gebruiker
        if (conversationId !== session.user.email) {
          return createErrorResponse(null, 'Geen toegang tot deze conversatie', 403)
        }
      }
    } else {
      // Gast gebruiker: strengere validatie
      // Check of dit conversationId inderdaad bij een gast conversatie hoort
      // We kunnen niet valideren op basis van email omdat die niet meegegeven wordt
      // Maar we kunnen wel checken of dit conversationId al bestaat en bij een gast hoort
      
      // Haal eerste message op om te checken of het een gast conversatie is
      const firstMessage = await prisma.chatMessage.findFirst({
        where: { conversationId },
        select: { senderEmail: true, senderName: true, userId: true },
      })

      // Als de conversatie bestaat maar er is een userId, dan is het geen gast conversatie
      // En gasten mogen niet in ingelogde gebruiker conversaties kijken
      if (firstMessage && firstMessage.userId) {
        return createErrorResponse(null, 'Geen toegang tot deze conversatie', 403)
      }

      // Als de conversatie bestaat en het is een gast (geen userId), laat het toe
      // Als de conversatie niet bestaat, laat het toe (nieuwe conversatie)
      // Maar voorkom dat gasten email-adressen kunnen gebruiken als conversationId
      if (!conversationId.startsWith('guest-') && conversationId.includes('@')) {
        // Als het een email lijkt, weiger het voor gasten (tenzij ze die email zelf hebben gebruikt)
        // Dit voorkomt dat gasten kunnen gokken op email-adressen
        if (!firstMessage || !firstMessage.senderEmail || conversationId !== firstMessage.senderEmail) {
          // Alleen toegang als dit conversationId overeenkomt met de senderEmail van de eerste message
          // Of als het een nieuwe conversatie is (firstMessage is null)
          // Maar voor nieuwe conversaties moeten gasten "guest-" prefix gebruiken
          return createErrorResponse(null, 'Ongeldige conversatie ID voor gast gebruikers', 403)
        }
      }
    }

    // Haal messages op voor deze conversatie
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    // Markeer messages als gelezen als admin ze ophaalt
    if (session?.user?.role === 'admin') {
      await prisma.chatMessage.updateMany({
        where: {
          conversationId,
          senderType: 'client',
          read: false,
        },
        data: {
          read: true,
        },
      })
    }

    return NextResponse.json({ messages }, { status: 200 })
  } catch (error) {
    return createErrorResponse(error, 'Fout bij ophalen chat messages', 500)
  }
}

// POST - Verstuur een chat message
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    // Valideer input
    const validatedData = chatMessageSchema.parse(body)

    // Bepaal sender informatie
    let userId: string | undefined
    let senderName: string | undefined
    let senderEmail: string | undefined
    let senderType: 'client' | 'admin'

    if (session?.user?.role === 'admin') {
      // Admin message
      userId = session.user.id
      senderName = session.user.name
      senderEmail = session.user.email
      senderType = 'admin'
    } else if (session?.user) {
      // Ingelogde gebruiker
      userId = session.user.id
      senderName = session.user.name
      senderEmail = session.user.email
      senderType = 'client'
    } else {
      // Gast gebruiker - valideer dat naam en email zijn meegegeven
      if (!validatedData.senderName || !validatedData.senderEmail) {
        return createErrorResponse(null, 'Naam en email zijn verplicht voor gast gebruikers', 400)
      }
      // Valideer email formaat
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(validatedData.senderEmail)) {
        return createErrorResponse(null, 'Ongeldig email formaat', 400)
      }
      senderName = validatedData.senderName.trim()
      senderEmail = validatedData.senderEmail.trim()
      senderType = 'client'
    }

    // Maak chat message aan
    const chatMessage = await prisma.chatMessage.create({
      data: {
        conversationId: validatedData.conversationId,
        userId,
        senderName,
        senderEmail,
        message: validatedData.message,
        senderType,
        read: senderType === 'admin', // Admin messages zijn altijd "gelezen"
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({ message: chatMessage }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(error, 'Validatie fout', 400)
    }

    return createErrorResponse(error, 'Fout bij versturen chat message', 500)
  }
}

