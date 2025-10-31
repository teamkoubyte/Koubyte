'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export default function EditReviewPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const reviewId = params.id as string

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [success, setSuccess] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    comment: '',
  })

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Haal review op
  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    fetch(`/api/reviews/user`)
      .then(res => res.json())
      .then(data => {
        const review = data.reviews?.find((r: any) => r.id === reviewId)
        if (review) {
          setRating(review.rating)
          setFormData({
            name: review.name || session.user?.name || '',
            email: review.email || session.user?.email || '',
            service: review.service || '',
            comment: review.comment || '',
          })
        } else {
          showToast('Review niet gevonden', 'error')
          router.push('/dashboard')
        }
      })
      .catch(err => {
        console.error('Error fetching review:', err)
        showToast('Fout bij ophalen review', 'error')
      })
      .finally(() => setFetching(false))
  }, [reviewId, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      showToast('Geef een beoordeling (1-5 sterren)', 'error')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/reviews/user/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: formData.comment,
          service: formData.service,
        }),
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        const data = await response.json()
        showToast(data.error || 'Er ging iets mis. Probeer het opnieuw.', 'error')
      }
    } catch (error) {
      console.error('Review error:', error)
      showToast('Er ging iets mis.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Weet je zeker dat je deze review wilt verwijderen?')) return

    setLoading(true)

    try {
      const response = await fetch(`/api/reviews/user/${reviewId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        showToast('Review succesvol verwijderd', 'success')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        const data = await response.json()
        showToast(data.error || 'Er ging iets mis.', 'error')
      }
    } catch (error) {
      console.error('Delete error:', error)
      showToast('Er ging iets mis.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Review laden...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white border-2 border-green-500 rounded-2xl p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Review bijgewerkt!</h2>
            <p className="text-xl text-slate-600 mb-4">
              Je review wordt opnieuw nagekeken door ons team voordat deze online verschijnt.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg">
                  Terug naar Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16 px-4">
      <div className="container mx-auto max-w-2xl">
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
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Review bewerken
          </h1>
          <p className="text-xl text-slate-600">
            Bewerk je review voor Koubyte
          </p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Bewerk je review</CardTitle>
            <CardDescription>
              Je review wordt opnieuw gecontroleerd na wijziging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Sterren */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">Jouw beoordeling *</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-12 h-12 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-slate-600 mt-2">
                    {rating === 5 && '⭐ Uitstekend!'}
                    {rating === 4 && '✨ Erg goed!'}
                    {rating === 3 && '👍 Goed'}
                    {rating === 2 && '😐 Kan beter'}
                    {rating === 1 && '😞 Niet tevreden'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="service">Welke dienst heb je gebruikt? *</Label>
                <Input
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  required
                  className="mt-2"
                  placeholder="Bijv. Hardware reparatie, Software installatie"
                />
              </div>

              <div>
                <Label htmlFor="comment">Je review *</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                  rows={6}
                  className="mt-2"
                  placeholder="Vertel over je ervaring met Koubyte..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-slate-700">
                <p className="font-semibold mb-2">ℹ️ Let op:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Je review wordt opnieuw gecontroleerd na wijziging</li>
                  <li>Wees eerlijk en respectvol in je beoordeling</li>
                  <li>Je email adres wordt niet gepubliceerd</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                  disabled={loading || rating === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    'Review bijwerken'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="px-6"
                  disabled={loading}
                >
                  Verwijder
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors inline-flex items-center gap-2"
          >
            ← Terug naar dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

