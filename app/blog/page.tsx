import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BlogFilters } from '@/components/BlogFilters'
import { Calendar, Eye, ArrowRight, FileText } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Koubyte IT-diensten',
  description: 'Lees onze nieuwste artikelen over IT-ondersteuning, hardware reparatie, software installatie en meer.',
  openGraph: {
    title: 'Blog - Koubyte IT-diensten',
    description: 'Lees onze nieuwste artikelen over IT-ondersteuning, hardware reparatie, software installatie en meer.',
    url: 'https://koubyte.be/blog',
    siteName: 'Koubyte',
  },
}

function getCategoryLabel(value: string) {
  const labels: Record<string, string> = {
    hardware: 'Hardware',
    software: 'Software',
    network: 'Netwerk',
    security: 'Beveiliging',
    tips: 'Tips & Tricks',
  }
  return labels[value] || value
}

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : 'all'
  const search = typeof searchParams.search === 'string' ? searchParams.search : ''

  const where: any = { published: true }
  
  if (category !== 'all') {
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
    take: 50,
  })

  // Count posts per category
  const categoryCounts = await prisma.blogPost.groupBy({
    by: ['category'],
    where: { published: true },
    _count: true,
  })

  const categoryCountMap = new Map(
    categoryCounts.map(c => [c.category, c._count])
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Koubyte Blog
            </h1>
            <p className="text-lg sm:text-xl text-blue-100">
              Handige tips, nieuws en gidsen voor IT-ondersteuning en reparatie
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12">
        {/* Filters - Client Component */}
        <BlogFilters 
          initialCategory={category} 
          initialSearch={search}
          categoryCounts={categoryCountMap}
        />

        {/* Blog Posts Grid - RESPONSIVE */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 flex flex-col">
                {post.image && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <CardHeader className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {getCategoryLabel(post.category)}
                    </span>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="mt-2 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {post.tags && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.split(',').slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-slate-500 pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString('nl-BE', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.viewCount}</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:gap-2 transition-all">
                      Lees verder
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 sm:py-16">
            <CardContent className="space-y-4">
              <FileText className="w-16 h-16 mx-auto text-slate-300" />
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
                  Geen artikelen gevonden
                </h3>
                <p className="text-slate-600">
                  {search || category !== 'all' 
                    ? 'Probeer andere zoektermen of categorieën' 
                    : 'Er zijn momenteel geen blogposts beschikbaar'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
