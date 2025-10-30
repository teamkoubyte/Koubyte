'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, CheckCircle, Trash2, ShoppingCart, CreditCard, Building2, Smartphone, Wallet, Apple, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { CartItemWithService } from '@/lib/cart'
import { calculateCartTotal } from '@/lib/cart'

// Payment Method Logo Components
const KlarnaLogo = () => (
  <svg viewBox="0 0 80 40" className="h-6 w-auto">
    <rect width="80" height="40" rx="4" fill="#FFB3C7"/>
    <text x="40" y="26" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#000" textAnchor="middle">Klarna</text>
  </svg>
)

const IdealLogo = () => (
  <svg viewBox="0 0 80 40" className="h-6 w-auto">
    <rect width="80" height="40" rx="4" fill="#CC0066"/>
    <text x="40" y="26" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#FFF" textAnchor="middle">iDEAL</text>
  </svg>
)

const ApplePayLogo = () => (
  <svg viewBox="0 0 80 40" className="h-6 w-auto">
    <rect width="80" height="40" rx="4" fill="#000"/>
    <path d="M25,15c-0.9,0.9-2.3,1.6-3.7,1.5c-0.2-1.4,0.5-2.8,1.3-3.7c0.9-1,2.4-1.7,3.6-1.8C26.4,12.4,25.8,13.9,25,15z M26.2,16.7c-2,0-2.9,1-4.3,1c-1.5,0-2.6-1-4.2-1c-2.2,0-4.5,1.3-6,3.6c-2.1,3.2-1.7,9.3,1.7,14.6c1.2,1.8,2.7,3.9,4.8,3.9c1.8,0,2.3-1.2,4.3-1.2c2,0,2.4,1.2,4.2,1.2c2.1,0,3.5-2,4.7-3.8c0.9-1.4,1.2-2.1,1.9-3.7c-4.9-1.9-5.7-9-0.9-11.5C30.5,17.5,28.3,16.7,26.2,16.7z" fill="#FFF"/>
    <text x="45" y="26" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="600" fill="#FFF">Pay</text>
  </svg>
)

const GooglePayLogo = () => (
  <svg viewBox="0 0 80 40" className="h-6 w-auto">
    <rect width="80" height="40" rx="4" fill="#FFF" stroke="#E8E8E8" strokeWidth="1"/>
    <path d="M35,18.5v7h-1.7v-16h4.6c1.1,0,2.1,0.4,2.8,1.1c0.8,0.7,1.2,1.7,1.2,2.8c0,1.1-0.4,2-1.2,2.7c-0.8,0.7-1.7,1.1-2.8,1.1h-2.9V18.5z M35,11.2v5.6h3c0.7,0,1.3-0.2,1.8-0.7c0.5-0.5,0.7-1.1,0.7-1.8c0-0.7-0.2-1.3-0.7-1.8c-0.5-0.5-1.1-0.7-1.8-0.7h-3V11.2z" fill="#5F6368"/>
    <path d="M46.8,14.6c1.4,0,2.5,0.4,3.3,1.2c0.8,0.8,1.2,1.9,1.2,3.3v6.3h-1.6v-1.4h-0.1c-0.7,1.1-1.7,1.7-3,1.7c-1.1,0-2-0.3-2.7-1c-0.7-0.6-1.1-1.5-1.1-2.5c0-1.1,0.4-1.9,1.2-2.5c0.8-0.6,1.8-0.9,3.1-0.9c1.1,0,2,0.2,2.7,0.6v-0.4c0-0.7-0.3-1.3-0.8-1.7c-0.5-0.5-1.1-0.7-1.9-0.7c-1.1,0-2,0.5-2.6,1.4l-1.5-0.9C43.9,15.4,45.2,14.6,46.8,14.6z M44.4,21.8c0,0.5,0.2,0.9,0.7,1.3c0.4,0.3,0.9,0.5,1.5,0.5c0.8,0,1.6-0.3,2.2-0.9c0.6-0.6,0.9-1.3,0.9-2.1c-0.6-0.5-1.4-0.7-2.5-0.7c-0.8,0-1.4,0.2-1.9,0.5C44.7,20.8,44.4,21.2,44.4,21.8z" fill="#5F6368"/>
    <path d="M59.3,14.9l-5.9,13.6h-1.7l2.2-4.7l-3.9-8.9h1.8l2.9,7h0l2.8-7H59.3z" fill="#5F6368"/>
  </svg>
)

const SepaLogo = () => (
  <svg viewBox="0 0 80 40" className="h-6 w-auto">
    <rect width="80" height="40" rx="4" fill="#003399"/>
    <text x="40" y="26" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#FFF" textAnchor="middle">SEPA</text>
  </svg>
)

const BancontactLogo = () => (
  <svg viewBox="0 0 80 40" className="h-6 w-auto">
    <rect width="80" height="40" rx="4" fill="#005498"/>
    <rect x="10" y="12" width="60" height="16" rx="2" fill="#FFF"/>
    <circle cx="25" cy="20" r="5" fill="#005498"/>
    <circle cx="32" cy="20" r="5" fill="#FFD200" fillOpacity="0.8"/>
  </svg>
)

const StripeLogo = () => (
  <svg viewBox="0 0 80 40" className="h-6 w-auto">
    <rect width="80" height="40" rx="4" fill="#635BFF"/>
    <text x="40" y="26" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="600" fill="#FFF" textAnchor="middle">Link</text>
  </svg>
)

type PaymentMethod = 'bancontact' | 'creditcard' | 'afterservice' | 'banktransfer' | 'ideal' | 'klarna' | 'link' | 'applepay' | 'googlepay' | 'sepa_debit'

const paymentMethods = [
  { id: 'bancontact' as PaymentMethod, name: 'Bancontact', icon: CreditCard, logo: BancontactLogo, description: 'Online betalen met Bancontact', popular: true },
  { id: 'creditcard' as PaymentMethod, name: 'Creditcard', icon: CreditCard, logo: null, description: 'Visa, Mastercard, American Express', popular: true },
  { id: 'ideal' as PaymentMethod, name: 'iDEAL', icon: Building2, logo: IdealLogo, description: 'Online betalen via Nederlandse bank', popular: false },
  { id: 'klarna' as PaymentMethod, name: 'Klarna', icon: Wallet, logo: KlarnaLogo, description: 'Koop nu, betaal later', popular: true },
  { id: 'link' as PaymentMethod, name: 'Link', icon: Zap, logo: StripeLogo, description: 'Snelle checkout met Stripe Link', popular: false },
  { id: 'applepay' as PaymentMethod, name: 'Apple Pay', icon: Apple, logo: ApplePayLogo, description: 'Betaal met Apple Pay', popular: false },
  { id: 'googlepay' as PaymentMethod, name: 'Google Pay', icon: Smartphone, logo: GooglePayLogo, description: 'Betaal met Google Pay', popular: false },
  { id: 'sepa_debit' as PaymentMethod, name: 'SEPA Domiciliëring', icon: Building2, logo: SepaLogo, description: 'Automatische incasso', popular: false },
  { id: 'afterservice' as PaymentMethod, name: 'Betalen na afloop', icon: CheckCircle, logo: null, description: 'Betaal ter plaatse (cash, bancontact, overschrijving)', popular: false },
  { id: 'banktransfer' as PaymentMethod, name: 'Vooraf overschrijven', icon: Building2, logo: null, description: 'Betaal vooraf via bankoverschrijving', popular: false },
]

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItemWithService[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [paymentUrl, setPaymentUrl] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('bancontact')
  const [formData, setFormData] = useState({
    notes: '',
  })

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }
    fetchCart()
  }, [session, router])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.cartItems || [])
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Eerst de order aanmaken
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          notes: formData.notes,
          paymentMethod: selectedPaymentMethod 
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        console.error('Order creation failed:', errorData)
        throw new Error(`Order creation failed: ${errorData.error || 'Unknown error'}`)
      }

      const orderData = await orderResponse.json()
      console.log('Order created successfully:', orderData)
      setOrderNumber(orderData.orderNumber)

      // Voor "na afloop" en "banktransfer" geen online payment nodig
      if (['afterservice', 'banktransfer'].includes(selectedPaymentMethod)) {
        setSuccess(true)
        return
      }

      // Voor andere methoden: online payment initiëren
      const paymentResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.id,
          amount: total,
          method: selectedPaymentMethod,
          service: `Order ${orderData.orderNumber}`,
        }),
      })

      if (!paymentResponse.ok) {
        const paymentError = await paymentResponse.json()
        console.error('Payment creation failed:', paymentError)
        throw new Error(`Payment creation failed: ${paymentError.details || 'Unknown error'}`)
      }

      const paymentData = await paymentResponse.json()

      // Als er een paymentUrl is, redirect naar de betaalpagina
      if (paymentData.paymentUrl) {
        setPaymentUrl(paymentData.paymentUrl)
        window.location.href = paymentData.paymentUrl
      } else {
        setSuccess(true)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Er ging iets mis bij het plaatsen van je bestelling. Probeer het opnieuw.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white border-2 border-green-500 rounded-2xl p-12 text-center shadow-2xl animate-fadeInUp">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Bestelling geplaatst!</h2>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-slate-600 mb-2">Je bestelnummer:</p>
              <p className="text-3xl font-bold text-blue-600">{orderNumber}</p>
            </div>
            <p className="text-xl text-slate-600 mb-8">
              We nemen zo snel mogelijk contact met je op om een afspraak in te plannen.
              Je ontvangt een bevestiging op je email.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg">
                  Naar Dashboard
                </Button>
              </Link>
              <Link href="/diensten">
                <Button variant="outline" className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-6 text-lg font-semibold rounded-lg shadow-md">
                  Bekijk meer diensten
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-slate-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Je winkelwagentje is leeg</h2>
          <p className="text-xl text-slate-600 mb-8">
            Voeg diensten toe om een bestelling te plaatsen.
          </p>
          <Link href="/diensten">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg">
              Bekijk diensten
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const total = calculateCartTotal(cartItems)

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">Bestelling afronden</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">Je bestelling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{item.service.name}</h3>
                      <p className="text-sm text-slate-600">Aantal: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">€{(item.service.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Form */}
          <div className="space-y-6">
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">Totaal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600 mb-6">
                  €{total.toFixed(2)}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Betaalmethode selectie */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Kies je betaalmethode
                    </Label>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon
                        const Logo = method.logo
                        return (
                          <div
                            key={method.id}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`
                              relative p-4 border-2 rounded-lg cursor-pointer transition-all
                              ${selectedPaymentMethod === method.id 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-slate-200 hover:border-blue-300 bg-white'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                ${selectedPaymentMethod === method.id 
                                  ? 'border-blue-600' 
                                  : 'border-slate-300'
                                }
                              `}>
                                {selectedPaymentMethod === method.id && (
                                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                                )}
                              </div>
                              {Logo ? (
                                <div className="flex items-center justify-center">
                                  <Logo />
                                </div>
                              ) : Icon ? (
                                <Icon className="w-5 h-5 text-slate-600 flex-shrink-0" />
                              ) : null}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-900">{method.name}</span>
                                  {method.popular && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                      Populair
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600">{method.description}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-base font-semibold">
                      Opmerkingen <span className="text-slate-500 font-normal">(optioneel)</span>
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ notes: e.target.value })}
                      placeholder="Bijv: Voorkeur voor datum/tijd, specifieke wensen..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Betaling verwerken...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Betaal €{total.toFixed(2)}
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-slate-700">
                  <p className="font-semibold mb-2">Veilig betalen:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Alle betalingen zijn beveiligd met SSL encryptie</li>
                    <li>• Je gegevens worden nooit gedeeld</li>
                    <li>• Je ontvangt een bevestiging per email</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
