'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export default function ReviewPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [orderData, setOrderData] = useState<{ services: string[]; orderNumber: string } | null>(null)
  const [loadingOrder, setLoadingOrder] = useState(false)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Haal order data op als orderNumber in URL staat
  useEffect(() => {
    if (orderNumber) {
      setLoadingOrder(true)
      fetch(`/api/orders/order-by-number?orderNumber=${orderNumber}`)
        .then(res => res.json())
        .then(data => {
          if (data.order) {
            const services = data.order.items.map((item: any) => item.serviceName)
            setOrderData({
              services,
              orderNumber: data.order.orderNumber,
            })
            // Pre-fill service veld met eerste service
            setFormData(prev => ({
              ...prev,
              service: services[0] || '',
            }))
          }
        })
        .catch(err => console.error('Error fetching order:', err))
        .finally(() => setLoadingOrder(false))
    }
  }, [orderNumber])

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    service: '',
    comment: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      showToast('Geef een beoordeling (1-5 sterren)', 'error')
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
        showToast('Er ging iets mis. Probeer het opnieuw.', 'error')
      }
    } catch (error) {
      console.error('Review error:', error)
      showToast('Er ging iets mis.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-3 sm:px-4 bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden w-full">
        <div className="container mx-auto max-w-2xl w-full overflow-x-hidden px-3 sm:px-4">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16 px-3 sm:px-4 overflow-x-hidden w-full">
      <div className="container mx-auto max-w-2xl w-full overflow-x-hidden">
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
            Deel je ervaring
          </h1>
          <p className="text-xl text-slate-600">
            Hoe was de service van Koubyte? We horen graag je mening!
          </p>
          {orderData && (
            <div className="mt-4 inline-block bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-900">
                Review voor bestelling: <strong>{orderData.orderNumber}</strong>
              </p>
            </div>
          )}
          {loadingOrder && (
            <div className="mt-4 text-sm text-slate-500">
              Bestelling ophalen...
            </div>
          )}
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Schrijf een review</CardTitle>
            <CardDescription>
              Je review helpt andere klanten en ons om beter te worden
              {orderData && (
                <span className="block mt-2 text-blue-600 font-medium">
                  ✅ Bedankt voor je bestelling! We waarderen je feedback enorm.
                </span>
              )}
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
                {orderData && orderData.services.length > 0 ? (
                  <div className="mt-2">
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecteer een dienst</option>
                      {orderData.services.map((service, index) => (
                        <option key={index} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                      Selecteer de dienst uit je bestelling
                    </p>
                  </div>
                ) : (
                  <Input
                    id="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    required
                    className="mt-2"
                    placeholder="Bijv. Hardware reparatie, Software installatie"
                    disabled={loadingOrder}
                  />
                )}
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

