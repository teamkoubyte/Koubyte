'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, CheckCircle, Trash2, ShoppingCart, CreditCard, Building2, Smartphone, Wallet, Apple, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { CartItemWithService } from '@/lib/cart'
import { calculateCartTotal } from '@/lib/cart'
import { formatPrice } from '@/lib/utils'

// Payment Method Logo Components (Simple colored badges)
const KlarnaLogo = () => (
  <div className="px-3 py-1 rounded bg-pink-200 text-black font-bold text-xs">Klarna</div>
)

const IdealLogo = () => (
  <div className="px-3 py-1 rounded bg-pink-600 text-white font-bold text-xs">iDEAL</div>
)

const ApplePayLogo = () => (
  <div className="px-3 py-1 rounded bg-black text-white font-semibold text-xs">Apple Pay</div>
)

const GooglePayLogo = () => (
  <div className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 font-semibold text-xs">Google Pay</div>
)

const SepaLogo = () => (
  <div className="px-3 py-1 rounded bg-blue-900 text-white font-bold text-xs">SEPA</div>
)

const BancontactLogo = () => (
  <div className="px-3 py-1 rounded bg-blue-700 text-white font-bold text-xs">Bancontact</div>
)

const StripeLinkLogo = () => (
  <div className="px-3 py-1 rounded bg-indigo-600 text-white font-semibold text-xs">Link</div>
)

type PaymentMethod = 'bancontact' | 'creditcard' | 'afterservice' | 'banktransfer' | 'ideal' | 'klarna' | 'link' | 'applepay' | 'googlepay' | 'sepa_debit'

const paymentMethods = [
  { id: 'bancontact' as PaymentMethod, name: 'Bancontact', icon: CreditCard, logo: BancontactLogo, description: 'Online betalen met Bancontact', popular: true },
  { id: 'creditcard' as PaymentMethod, name: 'Creditcard', icon: CreditCard, logo: null, description: 'Visa, Mastercard, American Express', popular: true },
  { id: 'ideal' as PaymentMethod, name: 'iDEAL', icon: Building2, logo: IdealLogo, description: 'Online betalen via Nederlandse bank', popular: false },
  { id: 'klarna' as PaymentMethod, name: 'Klarna', icon: Wallet, logo: KlarnaLogo, description: 'Koop nu, betaal later', popular: true },
  { id: 'link' as PaymentMethod, name: 'Link', icon: Zap, logo: StripeLinkLogo, description: 'Snelle checkout met Stripe Link', popular: false },
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
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string
    discountAmount: number
    finalAmount: number
    description?: string
  } | null>(null)
  const [discountLoading, setDiscountLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Contactgegevens
    email: '',
    phone: '',
    // Persoonlijke gegevens
    firstName: '',
    lastName: '',
    company: '',
    // Adresgegevens
    street: '',
    houseNumber: '',
    city: '',
    postalCode: '',
    country: 'België',
    // Opmerkingen
    notes: '',
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    // Optioneel: vul gegevens in als gebruiker ingelogd is
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        email: session.user.email || '',
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
      }))
    }
    fetchCart()
  }, [session])

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

  const applyDiscountCode = async () => {
    if (!discountCode.trim()) {
      alert('Voer een kortingscode in')
      return
    }

    setDiscountLoading(true)
    try {
      const response = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: discountCode.trim().toUpperCase(),
          totalAmount: total 
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAppliedDiscount({
          code: data.code,
          discountAmount: data.discountAmount,
          finalAmount: data.finalAmount,
          description: data.description
        })
        alert(`Kortingscode toegepast! Je bespaart ${formatPrice(data.discountAmount)}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Ongeldige kortingscode')
        setAppliedDiscount(null)
      }
    } catch (error) {
      console.error('Error applying discount:', error)
      alert('Er ging iets mis bij het toepassen van de kortingscode')
      setAppliedDiscount(null)
    } finally {
      setDiscountLoading(false)
    }
  }

  const removeDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validatie
    if (!formData.email || !formData.phone || !formData.firstName || !formData.lastName) {
      alert('Vul alle verplichte velden in')
      return
    }
    
    if (!agreedToTerms) {
      alert('Je moet akkoord gaan met de voorwaarden')
      return
    }
    
    setSubmitting(true)

    try {
      // Voor guests: stuur cartItems mee (ze hebben geen database cart)
      const orderPayload: any = { 
        ...formData,
        paymentMethod: selectedPaymentMethod,
        isGuest: !session?.user,
        // Kortingscode info
        discountCode: appliedDiscount?.code,
        discountAmount: appliedDiscount?.discountAmount || 0,
        finalAmount: appliedDiscount?.finalAmount || total
      }
      
      if (!session?.user) {
        // Guest: voeg client-side cart items toe
        orderPayload.cartItems = cartItems.map(item => ({
          serviceId: item.serviceId,
          quantity: item.quantity
        }))
      }
      
      // Eerst de order aanmaken met alle gegevens
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
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
                      <p className="font-bold text-blue-600">{formatPrice(item.service.price * item.quantity)}</p>
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
                {/* Totaal met eventuele korting */}
                <div className="space-y-3 mb-6">
                  {appliedDiscount ? (
                    <>
                      <div className="flex justify-between text-lg text-slate-600">
                        <span>Subtotaal:</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                      <div className="flex justify-between text-lg text-green-600 font-semibold">
                        <span>Korting ({appliedDiscount.code}):</span>
                        <span>-{formatPrice(appliedDiscount.discountAmount)}</span>
                      </div>
                      <div className="border-t-2 border-slate-200 pt-3">
                        <div className="flex justify-between">
                          <span className="text-2xl font-semibold text-slate-900">Totaal:</span>
                          <span className="text-4xl font-bold text-blue-600">{formatPrice(appliedDiscount.finalAmount)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-4xl font-bold text-blue-600">
                      {formatPrice(total)}
                    </div>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contactgegevens */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Contactgegevens</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">E-mailadres *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="je@email.com"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefoonnummer *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+32 123 45 67 89"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Persoonlijke gegevens */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Persoonlijke gegevens</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Voornaam *</Label>
                        <Input
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          placeholder="Jan"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Achternaam *</Label>
                        <Input
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          placeholder="Jansen"
                          className="mt-2"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="company">Bedrijfsnaam <span className="text-slate-500">(optioneel)</span></Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="Jouw bedrijf BV"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Adresgegevens */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Adresgegevens</h3>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="street">Straatnaam</Label>
                        <Input
                          id="street"
                          value={formData.street}
                          onChange={(e) => setFormData({...formData, street: e.target.value})}
                          placeholder="Hoofdstraat"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="houseNumber">Nummer</Label>
                        <Input
                          id="houseNumber"
                          value={formData.houseNumber}
                          onChange={(e) => setFormData({...formData, houseNumber: e.target.value})}
                          placeholder="123"
                          className="mt-2"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Postcode</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                          placeholder="1000"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Stad</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          placeholder="Brussel"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

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

                  {/* Kortingscode */}
                  <div className="space-y-3">
                    <Label htmlFor="discount" className="text-base font-semibold">
                      Kortingscode <span className="text-slate-500 font-normal">(optioneel)</span>
                    </Label>
                    {appliedDiscount ? (
                      <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-green-900">
                            {appliedDiscount.code} toegepast!
                          </p>
                          {appliedDiscount.description && (
                            <p className="text-sm text-green-700">{appliedDiscount.description}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={removeDiscount}
                          className="text-green-600 hover:text-green-700 underline text-sm"
                        >
                          Verwijderen
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          id="discount"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          placeholder="Bijv: WELCOME10"
                          className="flex-1"
                          disabled={discountLoading}
                        />
                        <Button
                          type="button"
                          onClick={applyDiscountCode}
                          disabled={discountLoading || !discountCode.trim()}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {discountLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Toepassen'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Algemene voorwaarden */}
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm text-slate-700 cursor-pointer">
                      Ik ga akkoord met de{' '}
                      <Link href="/terms" target="_blank" className="text-blue-600 hover:underline font-semibold">
                        algemene voorwaarden
                      </Link>
                      {' '}en het{' '}
                      <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline font-semibold">
                        privacybeleid
                      </Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting || !agreedToTerms}
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
                        Betaal {formatPrice(appliedDiscount?.finalAmount || total)}
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
