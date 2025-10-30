'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ShoppingCart, 
  Check, 
  Clock, 
  Tag, 
  ArrowLeft, 
  Phone, 
  Mail,
  Loader2,
  Star,
  ChevronRight
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string | null
  category: string
  featured: boolean
}

interface ServiceDetailClientProps {
  service: Service
  relatedServices: Service[]
}

export default function ServiceDetailClient({ service, relatedServices }: ServiceDetailClientProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [addingToCart, setAddingToCart] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const addToCart = async () => {
    if (!session) {
      router.push('/auth/login?redirect=/diensten/' + service.id)
      return
    }

    setAddingToCart(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: service.id, quantity: 1 }),
      })

      if (response.ok) {
        const data = await response.json()
        window.dispatchEvent(new CustomEvent('cart-updated'))
        showToast(data.message || 'Toegevoegd aan winkelwagentje!', 'success')
        
        // Redirect naar checkout na 1 seconde
        setTimeout(() => {
          router.push('/checkout')
        }, 1000)
      } else {
        const error = await response.json()
        showToast(error.error || 'Fout bij toevoegen', 'error')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      showToast('Fout bij toevoegen aan winkelwagentje', 'error')
    } finally {
      setAddingToCart(false)
    }
  }

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2).replace('.', ',')}`
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slideInRight">
          <div className={`${
            toast.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          } border-2 rounded-lg shadow-2xl p-4 min-w-[300px]`}>
            <div className="flex items-start gap-3">
              <Check className={`w-6 h-6 ${
                toast.type === 'success' ? 'text-green-600' : 'text-red-600'
              } flex-shrink-0`} />
              <p className={`flex-1 ${
                toast.type === 'success' ? 'text-green-900' : 'text-red-900'
              } font-medium`}>
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="bg-white border-b py-4 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/diensten" className="hover:text-blue-600 transition">Diensten</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">{service.name}</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <Link 
          href="/diensten"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug naar alle diensten
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-slate-200">
              {service.featured && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <Star className="w-4 h-4 fill-blue-700" />
                  Populaire dienst
                </div>
              )}

              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                {service.name}
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                  <Tag className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-700">{service.category}</span>
                </div>

                {service.duration && (
                  <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-700">{service.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Wat is inbegrepen?</h2>
              <ul className="space-y-4">
                {getCategoryBenefits(service.category).map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-1 mt-0.5">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-slate-700 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How it Works */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8 border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Hoe werkt het?</h2>
              <div className="space-y-4">
                <ProcessStep 
                  number="1" 
                  title="Voeg toe aan winkelwagentje" 
                  description="Klik op de knop en de dienst wordt toegevoegd"
                />
                <ProcessStep 
                  number="2" 
                  title="Vul je gegevens in" 
                  description="We hebben enkele contactgegevens nodig"
                />
                <ProcessStep 
                  number="3" 
                  title="Kies een datum" 
                  description="Plan een afspraak op een moment dat jou schikt"
                />
                <ProcessStep 
                  number="4" 
                  title="Wij nemen contact op" 
                  description="We bevestigen de afspraak en komen langs"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Order Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <Card className="border-2 border-blue-500 shadow-2xl">
                <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-t-lg">
                  <CardTitle className="text-3xl font-bold">
                    {formatPrice(service.price)}
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-base">
                    Vaste prijs, geen verrassingen
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <Button
                    onClick={addToCart}
                    disabled={addingToCart}
                    className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {addingToCart ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Toevoegen...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingCart className="w-6 h-6" />
                        Bestel nu
                      </span>
                    )}
                  </Button>

                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Vaste prijs garantie</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Professionele service</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>100% klanttevredenheid</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Vragen over deze dienst?</CardTitle>
                  <CardDescription>
                    Neem gerust contact met ons op
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a 
                    href="tel:+32484522662"
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                  >
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-slate-500">Bel ons</div>
                      <div className="font-semibold text-slate-900">+32 484 52 26 62</div>
                    </div>
                  </a>

                  <a 
                    href="mailto:info@koubyte.be"
                    className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                  >
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-slate-500">Email ons</div>
                      <div className="font-semibold text-slate-900">info@koubyte.be</div>
                    </div>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Gerelateerde diensten</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((related) => (
                <Link 
                  key={related.id} 
                  href={`/diensten/${related.id}`}
                  className="group"
                >
                  <Card className="border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all h-full">
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition">
                        {related.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {related.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(related.price)}
                        </span>
                        <span className="text-sm text-slate-600">
                          {related.category}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper component voor process steps
function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  )
}

// Helper function voor category-specifieke voordelen
function getCategoryBenefits(category: string): string[] {
  const benefits: Record<string, string[]> = {
    'Hardware': [
      'Professionele diagnose van je hardware probleem',
      'Gebruik van hoogwaardige vervangingsonderdelen',
      'Uitgebreide tests na reparatie',
      'Garantie op uitgevoerde werkzaamheden',
      'Advies over preventief onderhoud',
    ],
    'Software': [
      'Installatie van alle benodigde software',
      'Optimale configuratie voor jouw situatie',
      'Basistraining over het gebruik',
      'Licentiecontrole en activatie',
      'Nazorg en ondersteuning',
    ],
    'Beveiliging': [
      'Uitgebreide security scan',
      'Installatie van beveiligingssoftware',
      'Firewall configuratie',
      'Advies over veilig internetgebruik',
      'Continue monitoring en updates',
    ],
    'Netwerk': [
      'Professionele netwerkconfiguratie',
      'Optimale WiFi dekking',
      'Veilige netwerkbeveiliging',
      'Internetsnelheid optimalisatie',
      'Documentatie van je netwerk',
    ],
    'Onderhoud': [
      'Grondige reiniging van hardware',
      'Software updates en optimalisatie',
      'Virusscans en malware verwijdering',
      'Prestatie analyse en verbetering',
      'Backup controle',
    ],
    'Data': [
      'Professionele data recovery tools',
      'Hoge slagingskans bij dataherstel',
      'Veilige backup oplossingen',
      'Encryptie van gevoelige data',
      'Cloud storage integratie',
    ],
  }

  return benefits[category] || [
    'Professionele uitvoering',
    'Ervaren technici',
    'Kwalitatieve service',
    'Klanttevredenheidsgarantie',
    'Persoonlijk advies',
  ]
}

