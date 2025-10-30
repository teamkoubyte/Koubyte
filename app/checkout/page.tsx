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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, CheckCircle, Trash2, ShoppingCart, CreditCard, Building2, Smartphone, Wallet, Apple, Zap, Plus, Minus, ArrowRight, ArrowLeft, MapPin, User, Briefcase, X } from 'lucide-react'
import Link from 'next/link'
import type { CartItemWithService } from '@/lib/cart'
import { calculateCartTotal } from '@/lib/cart'
import { formatPrice } from '@/lib/utils'

// Toast Notification Component
function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) {
  const bgColor = type === 'success' ? 'bg-green-50 border-green-500' : type === 'error' ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'
  const textColor = type === 'success' ? 'text-green-900' : type === 'error' ? 'text-red-900' : 'text-blue-900'
  const iconColor = type === 'success' ? 'text-green-600' : type === 'error' ? 'text-red-600' : 'text-blue-600'
  
  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} border-2 rounded-lg shadow-2xl p-4 min-w-[300px] max-w-md animate-slideInRight`}>
      <div className="flex items-start gap-3">
        {type === 'success' && <CheckCircle className={`w-6 h-6 ${iconColor} flex-shrink-0`} />}
        {type === 'error' && <X className={`w-6 h-6 ${iconColor} flex-shrink-0`} />}
        {type === 'info' && <CheckCircle className={`w-6 h-6 ${iconColor} flex-shrink-0`} />}
        <p className={`flex-1 ${textColor} font-medium`}>{message}</p>
        <button onClick={onClose} className={`${textColor} hover:opacity-70`}>
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Payment Method Logo Components
const KlarnaLogo = () => (<div className="px-3 py-1 rounded bg-pink-200 text-black font-bold text-xs">Klarna</div>)
const IdealLogo = () => (<div className="px-3 py-1 rounded bg-pink-600 text-white font-bold text-xs">iDEAL</div>)
const ApplePayLogo = () => (<div className="px-3 py-1 rounded bg-black text-white font-semibold text-xs">Apple Pay</div>)
const GooglePayLogo = () => (<div className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 font-semibold text-xs">Google Pay</div>)
const SepaLogo = () => (<div className="px-3 py-1 rounded bg-blue-900 text-white font-bold text-xs">SEPA</div>)
const BancontactLogo = () => (<div className="px-3 py-1 rounded bg-blue-700 text-white font-bold text-xs">Bancontact</div>)
const StripeLinkLogo = () => (<div className="px-3 py-1 rounded bg-indigo-600 text-white font-semibold text-xs">Link</div>)

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
  
  // State
  const [currentStep, setCurrentStep] = useState(1)
  const [cartItems, setCartItems] = useState<CartItemWithService[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('bancontact')
  const [customerType, setCustomerType] = useState<'particulier' | 'professioneel'>('particulier')
  
  // Discount
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string
    discountAmount: number
    finalAmount: number
    description?: string
  } | null>(null)
  const [discountLoading, setDiscountLoading] = useState(false)
  
  // Step 1: Service Location
  const [serviceLocation, setServiceLocation] = useState({
    street: '',
    houseNumber: '',
    bus: '',
    postalCode: '',
    city: '',
    notes: ''
  })
  
  // Step 2: Contact gegevens - Particulier
  const [particulierData, setParticulierData] = useState({
    gender: '' as 'man' | 'vrouw' | '',
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  })
  
  // Step 2: Contact gegevens - Professioneel
  const [professioneelData, setProfessioneelData] = useState({
    vat: '',
    companyForm: '',
    companyName: '',
    department: '',
    gender: '' as 'man' | 'vrouw' | '',
    firstName: '',
    lastName: '',
    postalCode: '',
    city: '',
    street: '',
    houseNumber: '',
    bus: '',
    extraAddress: '',
    phone: '',
    email: ''
  })
  
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const total = calculateCartTotal(cartItems)

  useEffect(() => {
    if (session?.user) {
      // Pre-fill if logged in
      if (customerType === 'particulier') {
        setParticulierData(prev => ({
          ...prev,
          email: session.user.email || '',
          firstName: session.user.name?.split(' ')[0] || '',
          lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        }))
      } else {
        setProfessioneelData(prev => ({
          ...prev,
          email: session.user.email || '',
          firstName: session.user.name?.split(' ')[0] || '',
          lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        }))
      }
    }
    fetchCart()
  }, [session, customerType])

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

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId: itemId, quantity: newQuantity }),
      })

      if (response.ok) {
        await fetchCart()
        window.dispatchEvent(new CustomEvent('cart-updated'))
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId: itemId }),
      })

      if (response.ok) {
        await fetchCart()
        window.dispatchEvent(new CustomEvent('cart-updated'))
        showToast('Item verwijderd uit winkelwagen', 'success')
      } else {
        showToast('Kon item niet verwijderen', 'error')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      showToast('Er ging iets mis', 'error')
    }
  }

  const applyDiscountCode = async () => {
    if (!discountCode.trim()) {
      showToast('Voer een kortingscode in', 'error')
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
        showToast(`Kortingscode toegepast! Je bespaart ${formatPrice(data.discountAmount)}`, 'success')
      } else {
        const error = await response.json()
        showToast(error.error || 'Ongeldige kortingscode', 'error')
        setAppliedDiscount(null)
      }
    } catch (error) {
      console.error('Error applying discount:', error)
      showToast('Er ging iets mis bij het toepassen van de kortingscode', 'error')
      setAppliedDiscount(null)
    } finally {
      setDiscountLoading(false)
    }
  }

  const removeDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode('')
  }

  // Validation functions
  const validateStep1 = () => {
    if (!serviceLocation.street || !serviceLocation.houseNumber || !serviceLocation.postalCode || !serviceLocation.city) {
      showToast('Vul alle verplichte velden in voor het dienstadres', 'error')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (customerType === 'particulier') {
      if (!particulierData.gender || !particulierData.firstName || !particulierData.lastName || !particulierData.phone || !particulierData.email) {
        showToast('Vul alle verplichte velden in', 'error')
        return false
      }
    } else {
      if (!professioneelData.companyForm || !professioneelData.companyName || !professioneelData.gender || 
          !professioneelData.firstName || !professioneelData.lastName || !professioneelData.postalCode ||
          !professioneelData.city || !professioneelData.street || !professioneelData.houseNumber ||
          !professioneelData.phone || !professioneelData.email) {
        showToast('Vul alle verplichte velden in', 'error')
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreedToTerms) {
      showToast('Je moet akkoord gaan met de voorwaarden', 'error')
      return
    }
    
    setSubmitting(true)

    try {
      const contactData = customerType === 'particulier' ? particulierData : professioneelData
      
      const orderPayload: any = { 
        ...serviceLocation,
        ...contactData,
        customerType,
        paymentMethod: selectedPaymentMethod,
        isGuest: !session?.user,
        discountCode: appliedDiscount?.code,
        discountAmount: appliedDiscount?.discountAmount || 0,
        finalAmount: appliedDiscount?.finalAmount || total
      }
      
      if (!session?.user) {
        orderPayload.cartItems = cartItems.map(item => ({
          serviceId: item.service.id,
          quantity: item.quantity
        }))
      }
      
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
      setOrderNumber(orderData.orderNumber)

      if (['afterservice', 'banktransfer'].includes(selectedPaymentMethod)) {
        setSuccess(true)
        return
      }

      const paymentResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.id,
          amount: (appliedDiscount?.finalAmount || total).toString(),
          method: selectedPaymentMethod,
        }),
      })

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json()
        throw new Error(errorData.error || 'Payment creation failed')
      }

      const paymentData = await paymentResponse.json()
      
      if (paymentData.checkoutUrl) {
        window.location.href = paymentData.checkoutUrl
      } else {
        setSuccess(true)
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      showToast('Er ging iets mis bij het plaatsen van je bestelling. Probeer het opnieuw.', 'error')
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
          <div className="bg-white border-2 border-green-500 rounded-2xl p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Bestelling geplaatst!</h2>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-slate-600 mb-2">Je bestelnummer:</p>
              <p className="text-3xl font-bold text-blue-600">{orderNumber}</p>
            </div>
            <p className="text-xl text-slate-600 mb-8">
              We nemen zo snel mogelijk contact met je op. Je ontvangt een bevestiging per email.
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

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-7xl">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg
                  ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'}
                `}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`
                    w-24 h-1 mx-2
                    ${currentStep > step ? 'bg-blue-600' : 'bg-slate-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 gap-32">
            <span className={`text-sm font-semibold ${currentStep === 1 ? 'text-blue-600' : 'text-slate-600'}`}>
              Winkelmandje
            </span>
            <span className={`text-sm font-semibold ${currentStep === 2 ? 'text-blue-600' : 'text-slate-600'}`}>
              Gegevens
            </span>
            <span className={`text-sm font-semibold ${currentStep === 3 ? 'text-blue-600' : 'text-slate-600'}`}>
              Betaling
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Winkelmandje & Dienstadres */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card className="shadow-2xl mb-8">
                  <CardHeader>
                    <CardTitle className="text-2xl">Je bestelling</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-lg truncate">{item.service.name}</h3>
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.service.description}</p>
                          <p className="text-base font-semibold text-slate-700 mt-2">{formatPrice(item.service.price)} per stuk</p>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-slate-300">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 disabled:opacity-30"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right min-w-[120px]">
                          <p className="text-sm text-slate-600 mb-1">Totaal:</p>
                          <p className="text-xl font-bold text-blue-600">
                            {formatPrice(item.service.price * item.quantity)}
                          </p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-3 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Service Location */}
                <Card className="shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <MapPin className="w-6 h-6" />
                      Waar moet de dienst uitgevoerd worden?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="serviceStreet">Straatnaam *</Label>
                        <Input
                          id="serviceStreet"
                          required
                          value={serviceLocation.street}
                          onChange={(e) => setServiceLocation({...serviceLocation, street: e.target.value})}
                          placeholder="Hoofdstraat"
                        />
                      </div>
                      <div>
                        <Label htmlFor="serviceHouseNumber">Nummer *</Label>
                        <Input
                          id="serviceHouseNumber"
                          required
                          value={serviceLocation.houseNumber}
                          onChange={(e) => setServiceLocation({...serviceLocation, houseNumber: e.target.value})}
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="servicePostalCode">Postcode *</Label>
                        <Input
                          id="servicePostalCode"
                          required
                          value={serviceLocation.postalCode}
                          onChange={(e) => setServiceLocation({...serviceLocation, postalCode: e.target.value})}
                          placeholder="1000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="serviceCity">Gemeente *</Label>
                        <Input
                          id="serviceCity"
                          required
                          value={serviceLocation.city}
                          onChange={(e) => setServiceLocation({...serviceLocation, city: e.target.value})}
                          placeholder="Brussel"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="serviceBus">Bus (optioneel)</Label>
                      <Input
                        id="serviceBus"
                        value={serviceLocation.bus}
                        onChange={(e) => setServiceLocation({...serviceLocation, bus: e.target.value})}
                        placeholder="A"
                      />
                    </div>

                    <div>
                      <Label htmlFor="serviceNotes">Opmerkingen (optioneel)</Label>
                      <Textarea
                        id="serviceNotes"
                        value={serviceLocation.notes}
                        onChange={(e) => setServiceLocation({...serviceLocation, notes: e.target.value})}
                        placeholder="Bijv: 2de verdieping, code 1234"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary */}
              <div>
                <Card className="shadow-2xl sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-2xl">Samenvatting</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                        <div className="flex justify-between">
                          <span className="text-2xl font-semibold text-slate-900">Totaal:</span>
                          <span className="text-4xl font-bold text-blue-600">{formatPrice(total)}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      onClick={nextStep}
                      className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                    >
                      Volgende stap
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* STEP 2: Contact Gegevens */}
          {currentStep === 2 && (
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-3xl text-center mb-6">Contactgegevens</CardTitle>
                  
                  {/* Customer Type Selection */}
                  <div className="flex gap-4 justify-center">
                    <button
                      type="button"
                      onClick={() => setCustomerType('particulier')}
                      className={`
                        flex-1 p-6 rounded-lg border-2 transition-all
                        ${customerType === 'particulier' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-slate-300 hover:border-blue-300'
                        }
                      `}
                    >
                      <User className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-semibold text-lg">Particulier</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerType('professioneel')}
                      className={`
                        flex-1 p-6 rounded-lg border-2 transition-all
                        ${customerType === 'professioneel' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-slate-300 hover:border-blue-300'
                        }
                      `}
                    >
                      <Briefcase className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-semibold text-lg">Professioneel</p>
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {customerType === 'particulier' ? (
                    /* PARTICULIER FORM */
                    <>
                      <div>
                        <Label>Geslacht *</Label>
                        <div className="flex gap-4 mt-2">
                          <button
                            type="button"
                            onClick={() => setParticulierData({...particulierData, gender: 'man'})}
                            className={`
                              flex-1 p-4 rounded-lg border-2 transition-all
                              ${particulierData.gender === 'man' 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-slate-300'
                              }
                            `}
                          >
                            Man
                          </button>
                          <button
                            type="button"
                            onClick={() => setParticulierData({...particulierData, gender: 'vrouw'})}
                            className={`
                              flex-1 p-4 rounded-lg border-2 transition-all
                              ${particulierData.gender === 'vrouw' 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-slate-300'
                              }
                            `}
                          >
                            Vrouw
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="partFirstName">Voornaam *</Label>
                          <Input
                            id="partFirstName"
                            required
                            value={particulierData.firstName}
                            onChange={(e) => setParticulierData({...particulierData, firstName: e.target.value})}
                            placeholder="Jan"
                          />
                        </div>
                        <div>
                          <Label htmlFor="partLastName">Familienaam *</Label>
                          <Input
                            id="partLastName"
                            required
                            value={particulierData.lastName}
                            onChange={(e) => setParticulierData({...particulierData, lastName: e.target.value})}
                            placeholder="Janssen"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="partPhone">GSM nummer *</Label>
                        <Input
                          id="partPhone"
                          type="tel"
                          required
                          value={particulierData.phone}
                          onChange={(e) => setParticulierData({...particulierData, phone: e.target.value})}
                          placeholder="+32 123 45 67 89"
                        />
                      </div>

                      <div>
                        <Label htmlFor="partEmail">E-mailadres *</Label>
                        <Input
                          id="partEmail"
                          type="email"
                          required
                          value={particulierData.email}
                          onChange={(e) => setParticulierData({...particulierData, email: e.target.value})}
                          placeholder="jan@email.com"
                        />
                      </div>
                    </>
                  ) : (
                    /* PROFESSIONEEL FORM */
                    <>
                      <div>
                        <Label htmlFor="profVat">BTW nummer (optioneel)</Label>
                        <Input
                          id="profVat"
                          value={professioneelData.vat}
                          onChange={(e) => setProfessioneelData({...professioneelData, vat: e.target.value})}
                          placeholder="BE 0123.456.789"
                        />
                      </div>

                      <div>
                        <Label htmlFor="profCompanyForm">Ondernemingsvorm *</Label>
                        <Select
                          value={professioneelData.companyForm}
                          onValueChange={(value) => setProfessioneelData({...professioneelData, companyForm: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer ondernemingsvorm" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eenmanszaak">Eenmanszaak</SelectItem>
                            <SelectItem value="bv">BV (Besloten Vennootschap)</SelectItem>
                            <SelectItem value="nv">NV (Naamloze Vennootschap)</SelectItem>
                            <SelectItem value="vzw">VZW</SelectItem>
                            <SelectItem value="vof">VOF (Vennootschap onder Firma)</SelectItem>
                            <SelectItem value="cv">CV (Commanditaire Vennootschap)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="profCompanyName">Naam van het bedrijf *</Label>
                        <Input
                          id="profCompanyName"
                          required
                          value={professioneelData.companyName}
                          onChange={(e) => setProfessioneelData({...professioneelData, companyName: e.target.value})}
                          placeholder="Bedrijfsnaam BV"
                        />
                      </div>

                      <div>
                        <Label htmlFor="profDepartment">Departement/Filiaal (optioneel)</Label>
                        <Input
                          id="profDepartment"
                          value={professioneelData.department}
                          onChange={(e) => setProfessioneelData({...professioneelData, department: e.target.value})}
                          placeholder="IT Afdeling"
                        />
                      </div>

                      <div>
                        <Label>Geslacht *</Label>
                        <div className="flex gap-4 mt-2">
                          <button
                            type="button"
                            onClick={() => setProfessioneelData({...professioneelData, gender: 'man'})}
                            className={`
                              flex-1 p-4 rounded-lg border-2 transition-all
                              ${professioneelData.gender === 'man' 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-slate-300'
                              }
                            `}
                          >
                            Man
                          </button>
                          <button
                            type="button"
                            onClick={() => setProfessioneelData({...professioneelData, gender: 'vrouw'})}
                            className={`
                              flex-1 p-4 rounded-lg border-2 transition-all
                              ${professioneelData.gender === 'vrouw' 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-slate-300'
                              }
                            `}
                          >
                            Vrouw
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="profFirstName">Voornaam *</Label>
                          <Input
                            id="profFirstName"
                            required
                            value={professioneelData.firstName}
                            onChange={(e) => setProfessioneelData({...professioneelData, firstName: e.target.value})}
                            placeholder="Jan"
                          />
                        </div>
                        <div>
                          <Label htmlFor="profLastName">Familienaam *</Label>
                          <Input
                            id="profLastName"
                            required
                            value={professioneelData.lastName}
                            onChange={(e) => setProfessioneelData({...professioneelData, lastName: e.target.value})}
                            placeholder="Janssen"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="profPostalCode">Postcode *</Label>
                          <Input
                            id="profPostalCode"
                            required
                            value={professioneelData.postalCode}
                            onChange={(e) => setProfessioneelData({...professioneelData, postalCode: e.target.value})}
                            placeholder="1000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="profCity">Gemeente *</Label>
                          <Input
                            id="profCity"
                            required
                            value={professioneelData.city}
                            onChange={(e) => setProfessioneelData({...professioneelData, city: e.target.value})}
                            placeholder="Brussel"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="profStreet">Straatnaam *</Label>
                          <Input
                            id="profStreet"
                            required
                            value={professioneelData.street}
                            onChange={(e) => setProfessioneelData({...professioneelData, street: e.target.value})}
                            placeholder="Hoofdstraat"
                          />
                        </div>
                        <div>
                          <Label htmlFor="profHouseNumber">Nummer *</Label>
                          <Input
                            id="profHouseNumber"
                            required
                            value={professioneelData.houseNumber}
                            onChange={(e) => setProfessioneelData({...professioneelData, houseNumber: e.target.value})}
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="profBus">Bus (optioneel)</Label>
                        <Input
                          id="profBus"
                          value={professioneelData.bus}
                          onChange={(e) => setProfessioneelData({...professioneelData, bus: e.target.value})}
                          placeholder="A"
                        />
                      </div>

                      <div>
                        <Label htmlFor="profExtraAddress">Extra adres, gebouw, bedrijf,... (optioneel)</Label>
                        <Input
                          id="profExtraAddress"
                          value={professioneelData.extraAddress}
                          onChange={(e) => setProfessioneelData({...professioneelData, extraAddress: e.target.value})}
                          placeholder="Gebouw C, 3de verdieping"
                        />
                      </div>

                      <div>
                        <Label htmlFor="profPhone">GSM nummer *</Label>
                        <Input
                          id="profPhone"
                          type="tel"
                          required
                          value={professioneelData.phone}
                          onChange={(e) => setProfessioneelData({...professioneelData, phone: e.target.value})}
                          placeholder="+32 123 45 67 89"
                        />
                      </div>

                      <div>
                        <Label htmlFor="profEmail">E-mailadres *</Label>
                        <Input
                          id="profEmail"
                          type="email"
                          required
                          value={professioneelData.email}
                          onChange={(e) => setProfessioneelData({...professioneelData, email: e.target.value})}
                          placeholder="info@bedrijf.be"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-4 pt-6 border-t">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 py-6 text-lg"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Vorige
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 py-6 text-lg bg-blue-600 hover:bg-blue-700"
                    >
                      Volgende
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 3: Betaling */}
          {currentStep === 3 && (
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-3xl text-center">Betaalmethode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Methods */}
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
                              <Logo />
                            ) : Icon ? (
                              <Icon className="w-5 h-5 text-slate-600" />
                            ) : null}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{method.name}</span>
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

                  {/* Discount Code */}
                  <div className="space-y-3 pt-6 border-t">
                    <Label className="text-base font-semibold">
                      Kortingscode <span className="text-slate-500 font-normal">(optioneel)</span>
                    </Label>
                    {appliedDiscount ? (
                      <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-green-900">{appliedDiscount.code} toegepast!</p>
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
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          placeholder="Bijv: WELCOME10"
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

                  {/* Total */}
                  <div className="pt-6 border-t">
                    {appliedDiscount ? (
                      <>
                        <div className="flex justify-between text-lg text-slate-600 mb-2">
                          <span>Subtotaal:</span>
                          <span>{formatPrice(total)}</span>
                        </div>
                        <div className="flex justify-between text-lg text-green-600 font-semibold mb-4">
                          <span>Korting ({appliedDiscount.code}):</span>
                          <span>-{formatPrice(appliedDiscount.discountAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center border-t-2 border-slate-200 pt-4">
                          <span className="text-2xl font-bold">Totaal:</span>
                          <span className="text-4xl font-bold text-blue-600">{formatPrice(appliedDiscount.finalAmount)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">Totaal:</span>
                        <span className="text-4xl font-bold text-blue-600">{formatPrice(total)}</span>
                      </div>
                    )}
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
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

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 py-6 text-lg"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Vorige
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || !agreedToTerms}
                      className="flex-1 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Verwerken...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Betaal {formatPrice(appliedDiscount?.finalAmount || total)}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </form>
        </div>
      </div>
    </>
  )
}

