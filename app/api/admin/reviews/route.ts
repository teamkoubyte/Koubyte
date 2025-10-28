import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get all reviews (for admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const reviews = await prisma.review.findMany({
      orderBy: [
        { approved: 'asc' }, // Pending first
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Get admin reviews error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}

