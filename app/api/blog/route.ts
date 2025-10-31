import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createErrorResponse } from '@/lib/api-error'

const blogPostSchema = z.object({
  title: z.string().min(1, 'Titel is verplicht'),
  slug: z.string().min(1, 'Slug is verplicht').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug mag alleen kleine letters, cijfers en streepjes bevatten'),
  excerpt: z.string().min(1, 'Samenvatting is verplicht'),
  content: z.string().min(1, 'Content is verplicht'),
  category: z.string().min(1, 'Categorie is verplicht'),
  tags: z.string().optional(),
  image: z.string().optional(),
  published: z.boolean().default(false),
})

// GET: Haal alle blogposts op
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (published === 'true') {
      where.published = true
    } else if (published === 'false') {
      where.published = false
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ]
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ posts }, { status: 200 })
  } catch (error: any) {
    return createErrorResponse(error, 'Fout bij ophalen blogposts', 500)
  }
}

// POST: Maak nieuwe blogpost (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = blogPostSchema.parse(body)

    // Check of slug al bestaat
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug bestaat al' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        ...validatedData,
        tags: validatedData.tags || '',
      },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(error, 'Validatie fout', 400)
    }

    return createErrorResponse(error, 'Fout bij aanmaken blogpost', 500)
  }
}

