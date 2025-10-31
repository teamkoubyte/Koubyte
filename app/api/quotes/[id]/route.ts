import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createErrorResponse } from '@/lib/api-error'

interface RouteParams {
  params: Promise<{ id: string }>
}

const updateQuoteSchema = z.object({
  status: z.enum(['pending', 'sent', 'accepted', 'rejected']).optional(),
  adminNotes: z.string().optional(),
})

// PATCH: Update offerte (admin only)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateQuoteSchema.parse(body)

    const existingQuote = await prisma.quote.findUnique({
      where: { id },
    })

    if (!existingQuote) {
      return NextResponse.json({ error: 'Offerte niet gevonden' }, { status: 404 })
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json({ quote }, { status: 200 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(error, 'Validatie fout', 400)
    }

    return createErrorResponse(error, 'Fout bij bijwerken offerte', 500)
  }
}

