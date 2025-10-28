'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ReviewPage() {
  const { data: session } = useSession()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    service: '',
    comment: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert('Geef een beoordeling (1-5 sterren)')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rating,
          userId: session?.user?.id,
        }),
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        alert('Er ging iets mis. Probeer het opnieuw.')
      }
    } catch (error) {
      console.error('Review error:', error)
      alert('Er ging iets mis.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white border-2 border-green-500 rounded-2xl p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Bedankt voor je review!</h2>
            <p className="text-xl text-slate-600 mb-4">
              Je beoordeling wordt eerst nagekeken door ons team voordat deze online verschijnt.
            </p>
            <p className="text-slate-500 mb-8">
              We waarderen je feedback enorm! 🙏
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg">
                  Terug naar Home
                </Button>
              </Link>
              <Button 
                onClick={() => setSuccess(false)} 
                className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-6 text-lg font-semibold rounded-lg shadow-md"
              >
                Nog een review schrijven
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Deel je ervaring
          </h1>
          <p className="text-xl text-slate-600">
            Hoe was de service van Koubyte? We horen graag je mening!
          </p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Schrijf een review</CardTitle>
            <CardDescription>
              Je review helpt andere klanten en ons om beter te worden
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
                <Label htmlFor="name">Naam *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                  placeholder="Je naam"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-2"
                  placeholder="je@email.be"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Je email wordt niet gepubliceerd
                </p>
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
                  <li>Je review wordt eerst gecontroleerd voordat deze online komt</li>
                  <li>Wees eerlijk en respectvol in je beoordeling</li>
                  <li>Je email adres wordt niet gepubliceerd</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                disabled={loading || rating === 0}
              >
                {loading ? 'Review versturen...' : 'Review plaatsen'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

