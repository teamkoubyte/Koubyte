'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Calculator, CheckCircle, Loader2, AlertCircle, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
}

export default function QuotePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [estimatedPrice, setEstimatedPrice] = useState(0)
  
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    description: '',
  })

  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }))
    }
  }, [session])

  useEffect(() => {
    // Bereken geschatte prijs op basis van geselecteerde services
    const total = Array.from(selectedServices).reduce((sum, serviceId) => {
      const service = services.find(s => s.id === serviceId)
      return sum + (service?.price || 0)
    }, 0)
    setEstimatedPrice(total)
  }, [selectedServices, services])

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

  const toggleService = (serviceId: string) => {
    const newSelected = new Set(selectedServices)
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId)
    } else {
      newSelected.add(serviceId)
    }
    setSelectedServices(newSelected)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.description) {
      setError('Vul alle verplichte velden in')
      return
    }

    if (!acceptedPrivacy) {
      setError('Je moet het privacybeleid accepteren')
      return
    }

    setSubmitting(true)

    try {
      const selectedServiceNames = Array.from(selectedServices)
        .map(id => services.find(s => s.id === id)?.name)
        .filter(Boolean)
        .join(', ')

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service: selectedServiceNames || 'Aangepaste dienst',
          description: formData.description,
          estimatedPrice: estimatedPrice > 0 ? estimatedPrice : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Er is een fout opgetreden')
      }
    } catch (error) {
      console.error('Error submitting quote:', error)
      setError('Er is een fout opgetreden. Probeer het later opnieuw.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2).replace('.', ',')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden w-full px-3 sm:px-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <Card className="max-w-2xl w-full shadow-2xl border-2 border-green-500">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">Offerte aanvraag verzonden!</CardTitle>
            <CardDescription className="text-lg mt-2">
              We hebben je offerte aanvraag ontvangen en nemen zo snel mogelijk contact met je op.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Wat gebeurt er nu?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>We bekijken je aanvraag binnen 24 uur</li>
                    <li>Je ontvangt een email met een gedetailleerde offerte</li>
                    <li>We kunnen eventueel een afspraak plannen om je project te bespreken</li>
                  </ul>
                </div>
              </div>
            </div>

            {estimatedPrice > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Geschatte prijs op basis van geselecteerde services:</p>
                <p className="text-2xl font-bold text-blue-600">{formatPrice(estimatedPrice)}</p>
                <p className="text-xs text-slate-500 mt-1">* Dit is een schatting. De definitieve prijs kan afwijken.</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  setSuccess(false)
                  setSelectedServices(new Set())
                  setFormData({ ...formData, description: '' })
                  setError('')
                }}
                variant="outline"
                className="flex-1"
              >
                Nog een offerte aanvragen
              </Button>
              <Button
                onClick={() => router.push('/')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Terug naar home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-3 sm:px-4 overflow-x-hidden w-full">
      <div className="container mx-auto max-w-6xl w-full overflow-x-hidden">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Offerten Calculator
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Selecteer de diensten die je nodig hebt en ontvang een geschatte prijs. Vraag daarna een gedetailleerde offerte aan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Services Selection */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Selecteer diensten</CardTitle>
                <CardDescription>Kies de diensten waar je een offerte voor wilt ontvangen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.length > 0 ? (
                    services.map((service) => {
                      const isSelected = selectedServices.has(service.id)
                      return (
                        <div
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`
                            p-4 border-2 rounded-lg cursor-pointer transition-all
                            ${isSelected 
                              ? 'border-blue-600 bg-blue-50' 
                              : 'border-slate-200 hover:border-blue-300 bg-white'
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleService(service.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className="font-semibold text-slate-900 text-lg">{service.name}</h3>
                                <span className="text-lg font-bold text-blue-600 whitespace-nowrap">
                                  {formatPrice(service.price)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600">{service.description}</p>
                              <span className="inline-block mt-2 bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                                {service.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-600">
                      Geen services beschikbaar
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary & Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Summary */}
            <Card className="shadow-xl sticky top-24">
              <CardHeader>
                <CardTitle>Geschatte Prijs</CardTitle>
                <CardDescription>
                  {selectedServices.size > 0 
                    ? `${selectedServices.size} ${selectedServices.size === 1 ? 'dienst geselecteerd' : 'diensten geselecteerd'}` 
                    : 'Selecteer diensten'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedServices.size > 0 ? (
                    <>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {Array.from(selectedServices).map((serviceId) => {
                          const service = services.find(s => s.id === serviceId)
                          if (!service) return null
                          return (
                            <div key={serviceId} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                              <span className="text-sm text-slate-700 truncate flex-1 mr-2">{service.name}</span>
                              <span className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                                {formatPrice(service.price)}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="border-t border-slate-200 pt-4">
                        <div className="text-center py-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                          <p className="text-sm text-slate-600 mb-2">Geschat totaal</p>
                          <p className="text-4xl font-bold text-blue-600">
                            {formatPrice(estimatedPrice)}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
                      <p className="text-sm text-slate-500">Selecteer diensten om prijs te zien</p>
                    </div>
                  )}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
                    <p>* Dit is een geschatte prijs. De definitieve prijs kan afwijken op basis van specifieke eisen en omstandigheden.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quote Request Form */}
        <Card className="mt-6 sm:mt-8 shadow-xl">
          <CardHeader>
            <CardTitle>Offerte Aanvraag</CardTitle>
            <CardDescription>Vul je gegevens in om een gedetailleerde offerte te ontvangen</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-base font-semibold">
                    Naam *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-2 h-12"
                    placeholder="Je volledige naam"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-base font-semibold">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="mt-2 h-12"
                    placeholder="je@email.be"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="phone" className="text-base font-semibold">
                    Telefoon (optioneel)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2 h-12"
                    placeholder="+32 4XX XX XX XX"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-base font-semibold">
                    Beschrijf je project of wensen *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={6}
                    className="mt-2"
                    placeholder="Vertel ons meer over je project, specifieke eisen, tijdlijn, etc..."
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Hoe meer details je geeft, hoe nauwkeuriger onze offerte zal zijn.
                  </p>
                </div>
              </div>

              {estimatedPrice > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Geselecteerde diensten:</strong> {Array.from(selectedServices).map(id => {
                      const service = services.find(s => s.id === id)
                      return service?.name
                    }).filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              <div className="flex items-start gap-2">
                <Checkbox
                  id="privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                  required
                />
                <Label htmlFor="privacy" className="text-sm cursor-pointer">
                  Ik accepteer het{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                    privacybeleid
                  </Link>{' '}
                  en geef toestemming om contact met me op te nemen *
                </Label>
              </div>

              <Button
                type="submit"
                disabled={submitting || !acceptedPrivacy}
                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verzenden...
                  </>
                ) : (
                  'Offerte Aanvragen'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

