import { getRealStats } from '@/lib/stats'
import Link from 'next/link'

export default async function FooterStats() {
  const stats = await getRealStats()

  // Als we geen reviews hebben, toon een CTA om de eerste te worden
  if (stats.totalReviews === 0) {
    return (
      <Link href="/review">
        <div className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
          <div className="text-yellow-500 text-xl font-bold mb-1">★★★★★</div>
          <div className="text-sm font-semibold text-slate-900 mb-1">Wees de eerste!</div>
          <div className="text-xs text-slate-600">Schrijf een review →</div>
        </div>
      </Link>
    )
  }

  // Toon echte stats
  return (
    <Link href="/review">
      <div className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
        <div className="text-yellow-500 text-xl font-bold mb-1">
          {'★'.repeat(Math.round(stats.averageRating))}{'☆'.repeat(5 - Math.round(stats.averageRating))}
        </div>
        <div className="text-sm font-semibold text-slate-900 mb-1">
          {stats.averageRating} van 5
        </div>
        <div className="text-xs text-slate-600">
          {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
        </div>
      </div>
    </Link>
  )
}

