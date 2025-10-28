import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: [
        { popular: 'desc' },
        { category: 'asc' },
        { price: 'asc' },
      ],
    })

    return NextResponse.json({ services }, { status: 200 })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Fout bij ophalen diensten' }, { status: 500 })
  }
}

