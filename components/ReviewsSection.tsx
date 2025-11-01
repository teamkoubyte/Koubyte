'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import Link from 'next/link'
import { Button } from './ui/button'

interface Review {
  id: string
  name: string
  rating: number
  comment: string
  service: string
  createdAt: string
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState({ total: 0, averageRating: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews.slice(0, 6)) // Toon laatste 6
          setStats(data.stats || { total: 0, averageRating: 0 })
        } else {
          setReviews([])
          setStats({ total: 0, averageRating: 0 })
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Fetch reviews error:', err)
        // Graceful fallback: toon geen reviews, maar site blijft werken
        setReviews([])
        setStats({ total: 0, averageRating: 0 })
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <p className="text-center text-slate-600">Reviews laden...</p>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return (
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Wees de eerste die een review achterlaat!
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Heb je gebruik gemaakt van onze diensten? Deel je ervaring!
          </p>
          <Link href="/review">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg">
              Schrijf een review
            </Button>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-4 bg-slate-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Wat onze klanten zeggen
          </h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {stats.averageRating.toFixed(1)} / 5
            </div>
          </div>
          <p className="text-slate-600 text-lg">
            Gebaseerd op {stats.total} echte reviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-white hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-700 mb-4 line-clamp-4">{review.comment}</p>
                <div className="border-t border-slate-200 pt-4">
                  <p className="font-bold text-slate-900">{review.name}</p>
                  <p className="text-sm text-slate-600">{review.service}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/review">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg">
              Schrijf je eigen review
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

