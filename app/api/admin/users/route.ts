import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Haal alle gebruikers op
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            appointments: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Fout bij ophalen gebruikers' }, { status: 500 })
  }
}

// PATCH - Update gebruiker rol
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, role } = await request.json()

    // Voorkom dat admin zichzelf degradeert
    if (id === session.user.id && role !== 'admin') {
      return NextResponse.json({ error: 'Je kunt je eigen admin rol niet verwijderen' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            appointments: true,
            orders: true,
          },
        },
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Fout bij updaten gebruiker' }, { status: 500 })
  }
}

// DELETE - Verwijder gebruiker
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      console.log('❌ Unauthorized - not admin')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    console.log(`🔵 DELETE request received for user ID: ${id}`)

    if (!id) {
      console.log('❌ No ID provided')
      return NextResponse.json({ error: 'ID is verplicht' }, { status: 400 })
    }

    // Voorkom dat admin zichzelf verwijdert
    if (id === session.user.id) {
      console.log('❌ Cannot delete self')
      return NextResponse.json({ error: 'Je kunt jezelf niet verwijderen' }, { status: 400 })
    }

    console.log(`🗑️ Starting delete process for user ${id}...`)

    // Schakel foreign keys UIT voor deze connectie
    await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF;')
    console.log('   ⚙️ Foreign keys disabled')

    try {
      // Verwijder ALLES zonder transactie (simpeler)
      console.log('   🔄 Deleting OrderItems...')
      const orders = await prisma.order.findMany({ where: { userId: id }, select: { id: true } })
      for (const order of orders) {
        const deleted = await prisma.orderItem.deleteMany({ where: { orderId: order.id } })
        console.log(`      ✓ Deleted ${deleted.count} OrderItems for order ${order.id}`)
      }
      
      console.log('   🔄 Deleting Orders...')
      const deletedOrders = await prisma.order.deleteMany({ where: { userId: id } })
      console.log(`      ✓ Deleted ${deletedOrders.count} Orders`)
      
      console.log('   🔄 Deleting CartItems...')
      const deletedCart = await prisma.cartItem.deleteMany({ where: { userId: id } })
      console.log(`      ✓ Deleted ${deletedCart.count} CartItems`)
      
      console.log('   🔄 Deleting Appointments...')
      const deletedAppt = await prisma.appointment.deleteMany({ where: { userId: id } })
      console.log(`      ✓ Deleted ${deletedAppt.count} Appointments`)
      
      console.log('   🔄 Deleting Reviews...')
      const deletedReviews = await prisma.review.deleteMany({ where: { userId: id } })
      console.log(`      ✓ Deleted ${deletedReviews.count} Reviews`)
      
      console.log('   🔄 Deleting Quotes...')
      const deletedQuotes = await prisma.quote.deleteMany({ where: { userId: id } })
      console.log(`      ✓ Deleted ${deletedQuotes.count} Quotes`)
      
      console.log('   🔄 Deleting Sessions...')
      const deletedSessions = await prisma.session.deleteMany({ where: { userId: id } })
      console.log(`      ✓ Deleted ${deletedSessions.count} Sessions`)
      
      console.log('   🔄 Deleting Accounts...')
      const deletedAccounts = await prisma.account.deleteMany({ where: { userId: id } })
      console.log(`      ✓ Deleted ${deletedAccounts.count} Accounts`)
      
      console.log('   🔄 Deleting User...')
      await prisma.user.delete({ where: { id } })
      console.log(`   ✅ USER DELETED SUCCESSFULLY!`)

      return NextResponse.json({ success: true, message: 'Gebruiker succesvol verwijderd' })
    } finally {
      // Schakel foreign keys weer AAN
      await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON;')
      console.log('   ⚙️ Foreign keys re-enabled')
    }
  } catch (error) {
    console.error('❌ FATAL ERROR during delete:', error)
    console.error('❌ Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ 
      error: 'Fout bij verwijderen: ' + (error instanceof Error ? error.message : 'Onbekende fout')
    }, { status: 500 })
  }
}

