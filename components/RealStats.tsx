import { Star, CheckCircle } from 'lucide-react'
import { getRealStats } from '@/lib/stats'

export default async function RealStats() {
  const stats = await getRealStats()

  // Toon alleen als we echte data hebben
  if (stats.totalReviews === 0) {
    return (
      <div className="flex flex-wrap gap-8 pt-4">
        <div className="flex items-center gap-2 text-slate-700">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-semibold">Betrouwbare IT-diensten</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-8 pt-4">
      {/* Echte rating van echte reviews */}
      <div className="flex items-center gap-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-5 h-5 ${
                i < Math.round(stats.averageRating) 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-slate-300'
              }`} 
            />
          ))}
        </div>
        <span className="text-slate-700 font-semibold">
          {stats.averageRating > 0 ? `${stats.averageRating} van 5` : 'Nog geen reviews'}
        </span>
      </div>

      {/* Echt aantal tevreden klanten (uit reviews + completed appointments) */}
      {stats.totalClients > 0 && (
        <div className="flex items-center gap-2 text-slate-700">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-semibold">
            {stats.totalClients} {stats.totalClients === 1 ? 'klant' : 'klanten'}
          </span>
        </div>
      )}

      {/* Echt aantal reviews */}
      {stats.totalReviews > 0 && (
        <div className="flex items-center gap-2 text-slate-700">
          <Star className="w-5 h-5 text-blue-600" />
          <span className="font-semibold">
            {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      )}
    </div>
  )
}

