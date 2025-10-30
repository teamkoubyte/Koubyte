'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, ShoppingCart, Loader2, Star, Clock } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Service {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  popular: boolean
  features: string | null
  estimatedTime: string | null
  image: string | null
}

export default function DienstenPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const categories = [
    { value: 'all', label: 'Alle Diensten' },
    { value: 'Hardware', label: 'Hardware' },
    { value: 'Software', label: 'Software' },
    { value: 'Beveiliging', label: 'Beveiliging' },
    { value: 'Netwerk', label: 'Netwerk' },
    { value: 'Onderhoud', label: 'Onderhoud' },
    { value: 'Data', label: 'Data' },
  ]

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (serviceId: string) => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    setAddingToCart(serviceId)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, quantity: 1 }),
      })

      if (response.ok) {
        const data = await response.json()
        // Trigger cart refresh
        window.dispatchEvent(new CustomEvent('cart-updated'))
        
        // Show success toast
        setToastMessage(data.message || 'Toegevoegd aan winkelwagentje!')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } else {
        const error = await response.json()
        setToastMessage(error.error || 'Fout bij toevoegen')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      setToastMessage('Fout bij toevoegen aan winkelwagentje')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setAddingToCart(null)
    }
  }

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-24 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 animate-fadeInDown">
            Onze IT-Diensten
          </h1>
          <p className="text-xl text-slate-600 mb-4 animate-fadeInUp">
            Professionele IT-oplossingen met vaste prijzen. Geen verrassingen.
          </p>
          <p className="text-lg text-slate-500 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Kies je dienst, voeg toe aan winkelwagentje en plan je afspraak.
          </p>
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-4 z-[100000] animate-slideInRight">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <Check className="w-6 h-6" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <section className="py-6 sm:py-8 px-4 bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold whitespace-nowrap transition-all text-sm sm:text-base ${
                  selectedCategory === cat.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service) => {
              const features = service.features ? JSON.parse(service.features) : []
              
              return (
                <Card
                  key={service.id}
                  className={`relative hover:shadow-2xl transition-all duration-300 ${
                    service.popular ? 'border-2 border-blue-500' : 'border-2 border-slate-200'
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-white" />
                        Populair
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-slate-900">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600 mt-2">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-blue-600">€{service.price}</span>
                      <span className="text-slate-600">vaste prijs</span>
                    </div>

                    {/* Estimated Time */}
                    {service.estimatedTime && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>{service.estimatedTime}</span>
                      </div>
                    )}

                    {/* Features */}
                    {features.length > 0 && (
                      <ul className="space-y-2">
                        {features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => addToCart(service.id)}
                      disabled={addingToCart === service.id}
                      className="w-full py-6 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                    >
                      {addingToCart === service.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Toevoegen...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <ShoppingCart className="w-5 h-5" />
                          Toevoegen aan wagentje
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-slate-600">Geen diensten gevonden in deze categorie.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Vragen over een dienst?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Neem gerust contact met ons op. We helpen je graag met advies!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+32484522662">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-xl">
                Bel: +32 484 52 26 62
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-xl">
                Stuur een bericht
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

