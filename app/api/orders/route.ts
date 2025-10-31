import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email'
import { createErrorResponse } from '@/lib/api-error'

// POST - Create new order (supports both logged in users and guests)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    const body = await request.json()
    const { 
      email, 
      phone, 
      firstName, 
      lastName, 
      company,
      street,
      houseNumber,
      city,
      postalCode,
      country,
      notes, 
      paymentMethod,
      isGuest,
      cartItems: providedCartItems,
      discountCode,
      discountAmount,
      finalAmount 
    } = body

    // Voor guests: gebruik de meegegeven cart items (client-side)
    // Voor ingelogde users: haal uit database
    let cartItems
    let userId = session?.user?.id

    if (isGuest) {
      // Guest checkout: gebruik client-side cart
      if (!providedCartItems || providedCartItems.length === 0) {
        return NextResponse.json({ error: 'Winkelwagentje is leeg' }, { status: 400 })
      }
      
      // Valideer de cartItems en haal echte prijzen op uit de database
      const serviceIds = providedCartItems.map((item: any) => item.serviceId)
      const services = await prisma.service.findMany({
        where: { id: { in: serviceIds } }
      })
      
      cartItems = providedCartItems.map((item: any) => {
        const service = services.find(s => s.id === item.serviceId)
        if (!service) throw new Error(`Service ${item.serviceId} not found`)
        return {
          serviceId: item.serviceId,
          service,
          quantity: item.quantity
        }
      })
      
      // Voor guests: gebruik een dummy user ID (of maak een speciale guest user)
      const guestUser = await prisma.user.upsert({
        where: { email: 'guest@koubyte.be' },
        update: {},
        create: {
          email: 'guest@koubyte.be',
          name: 'Guest User',
          password: '', // Geen wachtwoord voor guest user
          emailVerified: true // Boolean, niet Date
        }
      })
      userId = guestUser.id
    } else {
      // Logged in user: haal cart uit database
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
      }
      
      cartItems = await prisma.cartItem.findMany({
        where: { userId: session.user.id },
        include: { service: true },
      })

      if (cartItems.length === 0) {
        return NextResponse.json({ error: 'Winkelwagentje is leeg' }, { status: 400 })
      }
    }

    // Calculate total (gebruik echte database prijzen)
    const totalAmount = cartItems.reduce((sum: number, item: any) => {
      return sum + (item.service.price * item.quantity)
    }, 0)

    // Ensure userId is defined
    if (!userId) {
      return NextResponse.json({ error: 'Geen gebruikers ID beschikbaar' }, { status: 400 })
    }

    // Generate order number
    const orderCount = await prisma.order.count()
    const orderNumber = `KOU-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, '0')}`

    // Als er een kortingscode is gebruikt, verhoog de usedCount
    if (discountCode) {
      await prisma.discountCode.update({
        where: { code: discountCode },
        data: { usedCount: { increment: 1 } }
      })
    }

    // Create order met alle nieuwe velden
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId,
        totalAmount,
        discountCode: discountCode || null,
        discountAmount: discountAmount || 0,
        finalAmount: finalAmount || totalAmount,
        status: 'pending',
        paymentMethod: paymentMethod || 'bancontact',
        paymentStatus: 'unpaid',
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerPhone: phone,
        firstName,
        lastName,
        company,
        street,
        houseNumber,
        city,
        postalCode,
        country,
        notes,
        isGuest: isGuest || false,
        items: {
          create: cartItems.map((item: any) => ({
            serviceId: item.serviceId,
            serviceName: item.service.name,
            price: item.service.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: { service: true },
        },
      },
    })

    // Clear cart (alleen voor ingelogde users)
    if (!isGuest && session?.user?.id) {
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id },
      })
    }

    // Email versturen naar klant
    try {
      const customerName = `${firstName} ${lastName}`
      const orderDate = new Date().toLocaleDateString('nl-BE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      await sendOrderConfirmationEmail(email, {
        name: customerName,
        orderNumber,
        orderDate,
        items: order.items.map((item: any) => ({
          serviceName: item.serviceName,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: totalAmount,
        discountAmount: discountAmount || 0,
        total: finalAmount || totalAmount,
        paymentMethod: paymentMethod || 'bancontact',
        address: street && houseNumber ? {
          street,
          houseNumber,
          postalCode,
          city,
          country: country || 'België',
        } : undefined,
      })
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
    }

    // Admin notification email
    try {
      await sendAdminNotificationEmail('order', {
        orderNumber,
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        total: finalAmount || totalAmount,
      })
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError)
    }

    return NextResponse.json({ 
      message: 'Bestelling geplaatst', 
      order, 
      id: order.id,
      orderNumber 
    }, { status: 201 })
  } catch (error: any) {
    return createErrorResponse(error, 'Fout bij plaatsen bestelling', 500)
  }
}

// GET - Get user's orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { service: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    return createErrorResponse(error, 'Fout bij ophalen bestellingen', 500)
  }
}

