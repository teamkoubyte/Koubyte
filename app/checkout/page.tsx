'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, CheckCircle, Trash2, ShoppingCart, CreditCard, Building2, Smartphone, Wallet } from 'lucide-react'
import Link from 'next/link'
import type { CartItemWithService } from '@/lib/cart'
import { calculateCartTotal } from '@/lib/cart'

// Bancontact Logo Component
const BancontactLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="#005498"/>
    <path d="M8 10h6c2 0 3.5 1 3.5 3s-1.5 3-3.5 3H8v-6zm0 8h6.5c2.5 0 4.5-1.5 4.5-4.5S16.5 9 14 9H6v12h2v-3z" fill="white"/>
    <path d="M22 10h8v2h-6v2h5v2h-5v2h6v2h-8v-10z" fill="white"/>
    <circle cx="36" cy="16" r="6" fill="white"/>
    <path d="M36 13v6m-3-3h6" stroke="#005498" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

type PaymentMethod = 'bancontact' | 'creditcard' | 'afterservice' | 'banktransfer' | 'cash' | 'ideal' | 'paypal'

const paymentMethods = [
  { id: 'bancontact' as PaymentMethod, name: 'Bancontact', icon: BancontactLogo, description: 'Online betalen met Bancontact', popular: true },
  { id: 'creditcard' as PaymentMethod, name: 'Creditcard', icon: CreditCard, description: 'Visa, Mastercard, American Express', popular: false },
  { id: 'afterservice' as PaymentMethod, name: 'Betalen na afloop', icon: CheckCircle, description: 'Betaal ter plaatse (cash, bancontact, overschrijving)', popular: false },
  { id: 'banktransfer' as PaymentMethod, name: 'Vooraf overschrijven', icon: Building2, description: 'Betaal vooraf via bankoverschrijving', popular: false },
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
        throw new Error('Order creation failed')
      }

      const orderData = await orderResponse.json()
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
        throw new Error('Payment creation failed')
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
                                w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${selectedPaymentMethod === method.id 
                                  ? 'border-blue-600' 
                                  : 'border-slate-300'
                                }
                              `}>
                                {selectedPaymentMethod === method.id && (
                                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                                )}
                              </div>
                              <Icon className="w-5 h-5 text-slate-600" />
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
