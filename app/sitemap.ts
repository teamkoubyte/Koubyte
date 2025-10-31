import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://koubyte.be'
  
  // Statische pagina's
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/diensten`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/review`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  try {
    // Haal alle services op uit database
    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    // Dynamische service pagina's (indien je later individuele service pagina's maakt)
    const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
      url: `${baseUrl}/diensten/${service.id}`,
      lastModified: service.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Haal alle gepubliceerde blogposts op (als BlogPost tabel bestaat)
    let blogPages: MetadataRoute.Sitemap = []
    try {
      const blogPosts = await prisma.blogPost.findMany({
        where: { published: true },
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
      })

      // Dynamische blog post pagina's
      blogPages = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    } catch (blogError: any) {
      // BlogPost tabel bestaat mogelijk niet - skip blog pages
      if (blogError?.code === 'P2021') {
        console.log('BlogPost tabel niet gevonden, blog pagina\'s worden overgeslagen')
      } else {
        console.error('Error fetching blog posts for sitemap:', blogError)
      }
    }

    return [...staticPages, ...servicePages, ...blogPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return alleen statische pagina's als database query faalt
    return staticPages
  }
}

