import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react'
import { Metadata } from 'next'
import { BlogShareButton } from '@/components/BlogShareButton'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  })

  if (!post || !post.published) {
    return {
      title: 'Blogpost niet gevonden - Koubyte',
    }
  }

  return {
    title: `${post.title} - Koubyte Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://koubyte.be/blog/${post.slug}`,
      siteName: 'Koubyte',
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      ...(post.image && {
        images: [{ url: post.image, alt: post.title }],
      }),
      tags: post.tags ? post.tags.split(',').map(t => t.trim()) : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(post.image && {
        images: [post.image],
      }),
    },
  }
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    hardware: 'Hardware',
    software: 'Software',
    network: 'Netwerk',
    security: 'Beveiliging',
    tips: 'Tips & Tricks',
  }
  return labels[category] || category
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  })

  if (!post || !post.published) {
    notFound()
  }

  // Get related posts (same category, exclude current)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      category: post.category,
      published: true,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 sm:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar blog
            </Button>
          </Link>

          <div className="max-w-3xl">
            <div className="mb-4">
              <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {getCategoryLabel(post.category)}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            
            <p className="text-lg sm:text-xl text-blue-100 mb-6">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString('nl-BE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount} views</span>
              </div>
              {post.tags && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>{post.tags.split(',').length} tags</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {post.image && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            <Card className="shadow-lg">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <div 
                  className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-code:text-blue-600 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-img:rounded-lg prose-img:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            {post.tags && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.split(',').map((tag, idx) => (
                    <span 
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Deel dit artikel</h3>
              <div className="flex gap-4">
                <BlogShareButton title={post.title} excerpt={post.excerpt} />
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Gerelateerde artikelen</h3>
                {relatedPosts.length > 0 ? (
                  <div className="space-y-4">
                    {relatedPosts.map((related) => (
                      <Link 
                        key={related.id}
                        href={`/blog/${related.slug}`}
                        className="block p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                          {related.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {related.excerpt}
                        </p>
                        <span className="text-xs text-slate-500 mt-1 block">
                          {new Date(related.createdAt).toLocaleDateString('nl-BE', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">Geen gerelateerde artikelen</p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link href="/blog">
            <Button variant="outline" size="lg" className="bg-white hover:bg-slate-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar alle artikelen
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

