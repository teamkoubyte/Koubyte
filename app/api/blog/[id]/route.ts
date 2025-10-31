import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

const blogPostSchema = z.object({
  title: z.string().min(1, 'Titel is verplicht').optional(),
  slug: z.string().min(1, 'Slug is verplicht').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug mag alleen kleine letters, cijfers en streepjes bevatten').optional(),
  excerpt: z.string().min(1, 'Samenvatting is verplicht').optional(),
  content: z.string().min(1, 'Content is verplicht').optional(),
  category: z.string().min(1, 'Categorie is verplicht').optional(),
  tags: z.string().optional(),
  image: z.string().optional(),
  published: z.boolean().optional(),
})

// GET: Haal specifieke blogpost op
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    
    const post = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json({ error: 'Blogpost niet gevonden' }, { status: 404 })
    }

    // Verhoog view count (alleen voor gepubliceerde posts of admin)
    const session = await getServerSession(authOptions)
    if (post.published || (session && session.user.role === 'admin')) {
      await prisma.blogPost.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ post }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Fout bij ophalen blogpost' },
      { status: 500 }
    )
  }
}

// PATCH: Update blogpost (admin only)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = blogPostSchema.parse(body)

    // Check of post bestaat
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Blogpost niet gevonden' }, { status: 404 })
    }

    // Check of slug al bestaat (bij andere post)
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: validatedData.slug },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug bestaat al' },
          { status: 400 }
        )
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json({ post }, { status: 200 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Fout bij bijwerken blogpost' },
      { status: 500 }
    )
  }
}

// DELETE: Verwijder blogpost (admin only)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const { id } = await params
    
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Blogpost niet gevonden' }, { status: 404 })
    }

    await prisma.blogPost.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Blogpost succesvol verwijderd' }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Fout bij verwijderen blogpost' },
      { status: 500 }
    )
  }
}

