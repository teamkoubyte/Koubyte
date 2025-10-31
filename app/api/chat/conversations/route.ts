import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Haal alle conversaties op (admin only)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    // Haal alle unieke conversaties op met laatste message
    const conversations = await prisma.chatMessage.findMany({
      where: {
        senderType: 'client', // Alleen client conversaties
      },
      orderBy: {
        createdAt: 'desc',
      },
      distinct: ['conversationId'],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Haal voor elke conversatie de laatste message en unread count
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const [lastMessage, unreadCount] = await Promise.all([
          prisma.chatMessage.findFirst({
            where: { conversationId: conv.conversationId },
            orderBy: { createdAt: 'desc' },
          }),
          prisma.chatMessage.count({
            where: {
              conversationId: conv.conversationId,
              senderType: 'client',
              read: false,
            },
          }),
        ])

        return {
          conversationId: conv.conversationId,
          userId: conv.userId,
          userName: conv.user?.name || conv.senderName || 'Gast',
          userEmail: conv.user?.email || conv.senderEmail || 'Onbekend',
          lastMessage: lastMessage?.message || '',
          lastMessageTime: lastMessage?.createdAt || conv.createdAt,
          unreadCount,
        }
      })
    )

    // Sorteer op unread count en laatste message tijd
    conversationsWithDetails.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    })

    return NextResponse.json({ conversations: conversationsWithDetails }, { status: 200 })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Fout bij ophalen conversaties' }, { status: 500 })
  }
}

