import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// ⚠️ TIJDELIJK ENDPOINT - VERWIJDER NA GEBRUIK!
// Deze route maakt een admin account aan met de credentials uit .env

export async function GET() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({
        success: false,
        message: 'ADMIN_EMAIL en ADMIN_PASSWORD moeten ingesteld zijn in environment variables',
      }, { status: 400 })
    }

    // Check of admin al bestaat
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: `Admin account bestaat al met email: ${adminEmail}`,
      }, { status: 400 })
    }

    // Hash het wachtwoord
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Maak admin user aan
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Koubyte Admin',
        password: hashedPassword,
        role: 'admin',
        emailVerified: true, // Admin hoeft email niet te verifiëren
        verifiedAt: new Date(),
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Admin account succesvol aangemaakt!',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      }
    })

  } catch (error: any) {
    console.error('Error creating admin:', error)
    return NextResponse.json({
      success: false,
      message: 'Fout bij aanmaken admin account',
      error: error.message,
    }, { status: 500 })
  }
}

