'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { Card, CardContent } from './ui/card'

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
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews.slice(0, 6))
          setStats(data.stats || { total: 0, averageRating: 0 })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading || reviews.length === 0) return null

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50">
      <div className="container mx-auto max-w-7xl">

        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Wat klanten zeggen
          </h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-7 h-7 ${i < Math.round(stats.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.averageRating.toFixed(1)}</span>
          </div>
          <p className="text-slate-500 text-sm">Gebaseerd op {stats.total} reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="pt-5 pb-5">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <p className="text-slate-700 text-sm mb-4 line-clamp-4">{review.comment}</p>
                <div className="border-t border-slate-100 pt-3">
                  <p className="font-bold text-slate-900 text-sm">{review.name}</p>
                  <p className="text-xs text-slate-500">{review.service}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
