import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH - Approve/Reject review
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { approved } = body

    console.log(`📝 Updating review ${id}, approved: ${approved}`)

    const review = await prisma.review.update({
      where: { id },
      data: { approved },
    })

    console.log(`✅ Review ${id} updated successfully`)

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('❌ Review update error:', error)
    return NextResponse.json({ 
      error: 'Fout bij updaten review: ' + (error instanceof Error ? error.message : 'Onbekende fout')
    }, { status: 500 })
  }
}

// DELETE - Delete review
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const { id } = await params

    console.log(`🗑️ Deleting review ${id}`)

    await prisma.review.delete({
      where: { id },
    })

    console.log(`✅ Review ${id} deleted successfully`)

    return NextResponse.json({ success: true, message: 'Review succesvol verwijderd' })
  } catch (error) {
    console.error('❌ Review delete error:', error)
    return NextResponse.json({ 
      error: 'Fout bij verwijderen review: ' + (error instanceof Error ? error.message : 'Onbekende fout')
    }, { status: 500 })
  }
}

