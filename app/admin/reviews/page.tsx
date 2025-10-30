'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Trash2, Star } from 'lucide-react'

interface Review {
  id: string
  name: string
  rating: number
  comment: string
  service: string
  approved: boolean
  createdAt: string
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Fetch reviews error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast('Fout: ' + (data.error || 'Onbekende fout'), 'error')
        return
      }

      showToast('Review goedgekeurd', 'success')
      fetchReviews()
    } catch (error) {
      console.error('Approve error:', error)
      showToast('Fout: ' + (error instanceof Error ? error.message : 'Onbekende fout'), 'error')
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: false }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast('Fout: ' + (data.error || 'Onbekende fout'), 'error')
        return
      }

      showToast('Review afgekeurd', 'success')
      fetchReviews()
    } catch (error) {
      console.error('Reject error:', error)
      showToast('Fout: ' + (error instanceof Error ? error.message : 'Onbekende fout'), 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Weet je zeker dat je deze review wilt verwijderen?')) return

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        showToast('Fout: ' + (data.error || 'Onbekende fout'), 'error')
        return
      }

      showToast('Review verwijderd', 'success')
      fetchReviews()
    } catch (error) {
      console.error('Delete error:', error)
      showToast('Fout: ' + (error instanceof Error ? error.message : 'Onbekende fout'), 'error')
    }
  }

  const pendingReviews = reviews.filter(r => !r.approved)
  const approvedReviews = reviews.filter(r => r.approved)

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <p>Laden...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100000] border-2 rounded-lg shadow-2xl p-4 min-w-[280px] max-w-md animate-slideInRight ${
          toast.type === 'success' ? 'bg-green-50 border-green-500 text-green-900' : toast.type === 'error' ? 'bg-red-50 border-red-500 text-red-900' : 'bg-blue-50 border-blue-500 text-blue-900'
        }`}>
          <div className="flex items-start gap-3">
            <span className="font-semibold flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">×</button>
          </div>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reviews Beheer</h1>
        <p className="text-slate-600">Keur reviews goed of af, of verwijder ze</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wacht op goedkeuring</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-600">{pendingReviews.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Goedgekeurd</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">{approvedReviews.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gemiddelde Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">
              {approvedReviews.length > 0
                ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
                : '0.0'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Wacht op goedkeuring ({pendingReviews.length})
          </h2>
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <Card key={review.id} className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{review.name}</h3>
                      <p className="text-sm text-slate-600">{review.service}</p>
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString('nl-BE')}
                    </span>
                  </div>
                  <p className="text-slate-700 mb-4">{review.comment}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(review.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Goedkeuren
                    </Button>
                    <Button
                      onClick={() => handleDelete(review.id)}
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Verwijderen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approved Reviews */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Goedgekeurde reviews ({approvedReviews.length})
        </h2>
        {approvedReviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-slate-600">
              Nog geen goedgekeurde reviews
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvedReviews.map((review) => (
              <Card key={review.id} className="border-green-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{review.name}</h3>
                      <p className="text-sm text-slate-600">{review.service}</p>
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString('nl-BE')}
                    </span>
                  </div>
                  <p className="text-slate-700 mb-4">{review.comment}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReject(review.id)}
                      variant="outline"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Afkeuren
                    </Button>
                    <Button
                      onClick={() => handleDelete(review.id)}
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Verwijderen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

