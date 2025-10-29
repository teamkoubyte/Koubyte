import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const execAsync = promisify(exec)

// ⚠️ TIJDELIJK ENDPOINT - VERWIJDER NA GEBRUIK!
// Deze route: 1) Push database schema, 2) Maakt admin aan

export async function GET() {
  const steps: string[] = []
  
  try {
    // STAP 1: Push database schema
    steps.push('Starting database setup...')
    
    try {
      const { stdout: pushOutput } = await execAsync('npx prisma db push --accept-data-loss --skip-generate')
      steps.push('Database schema pushed successfully')
      steps.push(pushOutput)
    } catch (pushError: any) {
      steps.push('Database push failed, but continuing...')
      steps.push(pushError.stdout || pushError.message)
    }

    // STAP 2: Check admin credentials
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({
        success: false,
        message: 'ADMIN_EMAIL en ADMIN_PASSWORD moeten ingesteld zijn',
        steps,
      }, { status: 400 })
    }

    steps.push(`Creating admin with email: ${adminEmail}`)

    // STAP 3: Check of admin al bestaat
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: `Admin account bestaat al met email: ${adminEmail}`,
        steps,
      }, { status: 400 })
    }

    // STAP 4: Hash wachtwoord
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    steps.push('Password hashed')

    // STAP 5: Maak admin user aan
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Koubyte Admin',
        password: hashedPassword,
        role: 'admin',
        emailVerified: true,
        verifiedAt: new Date(),
      }
    })

    steps.push('Admin created successfully!')

    return NextResponse.json({
      success: true,
      message: '🎉 Database en admin account succesvol aangemaakt!',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      steps,
    })

  } catch (error: any) {
    console.error('Setup error:', error)
    return NextResponse.json({
      success: false,
      message: 'Fout tijdens setup',
      error: error.message,
      steps,
    }, { status: 500 })
  }
}

