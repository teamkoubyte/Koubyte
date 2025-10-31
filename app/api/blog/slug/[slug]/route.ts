import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createErrorResponse } from '@/lib/api-error'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET: Haal blogpost op via slug (voor public pagina's)
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params
    
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (!post) {
      return NextResponse.json({ error: 'Blogpost niet gevonden' }, { status: 404 })
    }

    // Verhoog view count alleen voor gepubliceerde posts
    if (post.published) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ post }, { status: 200 })
  } catch (error: any) {
    return createErrorResponse(error, 'Fout bij ophalen blogpost', 500)
  }
}

