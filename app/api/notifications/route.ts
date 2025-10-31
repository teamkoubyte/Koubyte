import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Haal alle notificaties op van ingelogde gebruiker
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const where: any = { userId: session.user.id }
    if (unreadOnly) {
      where.read = false
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Laatste 50 notificaties
    })

    // Tel ongelezen notificaties
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    })

    return NextResponse.json({ notifications, unreadCount }, { status: 200 })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Fout bij ophalen notificaties' }, { status: 500 })
  }
}

// POST - Maak nieuwe notificatie (admin only of systeem)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { userId, type, title, message, link, metadata } = body

    // Alleen admin kan notificaties aanmaken, of systeem (zonder session)
    if (session && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    if (!userId || !type || !title || !message) {
      return NextResponse.json({ 
        error: 'userId, type, title en message zijn verplicht' 
      }, { status: 400 })
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link: link || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        read: false,
      },
    })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Fout bij aanmaken notificatie' }, { status: 500 })
  }
}

// PATCH - Markeer notificatie(s) als gelezen
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId, markAllRead } = body

    if (markAllRead) {
      // Markeer alle notificaties als gelezen
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          read: false,
        },
        data: {
          read: true,
        },
      })
      return NextResponse.json({ message: 'Alle notificaties gemarkeerd als gelezen' }, { status: 200 })
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId is verplicht' }, { status: 400 })
    }

    // Check of notificatie van deze gebruiker is
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification) {
      return NextResponse.json({ error: 'Notificatie niet gevonden' }, { status: 404 })
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    return NextResponse.json({ notification: updated }, { status: 200 })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Fout bij updaten notificatie' }, { status: 500 })
  }
}

