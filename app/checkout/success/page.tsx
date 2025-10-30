'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Loader2, XCircle, Package, CreditCard, Calendar, Phone, Mail, Printer, Download, Clock } from 'lucide-react'
import Link from 'next/link'

type OrderItem = {
  id: string
  serviceName: string
  price: number
  quantity: number
}

type OrderData = {
  id: string
  orderNumber: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string
  createdAt: string
  items: OrderItem[]
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const demo = searchParams.get('demo')
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'failed'>('pending')
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  useEffect(() => {
    if (!orderId) {
      router.push('/checkout')
      return
    }

    // Check payment status and fetch order details
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const data = await response.json()
          setOrderData(data)
          
          if (data.paymentStatus === 'paid') {
            setPaymentStatus('success')
          } else if (data.paymentStatus === 'failed') {
            setPaymentStatus('failed')
          } else {
            setPaymentStatus('pending')
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
        setPaymentStatus('pending')
      } finally {
        setLoading(false)
      }
    }

    checkPaymentStatus()
  }, [orderId, router])

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      'bancontact': 'Bancontact',
      'creditcard': 'Creditcard',
      'ideal': 'iDEAL',
      'klarna': 'Klarna',
      'link': 'Stripe Link',
      'applepay': 'Apple Pay',
      'googlepay': 'Google Pay',
      'sepa_debit': 'SEPA Domiciliëring',
      'afterservice': 'Betalen na afloop',
      'banktransfer': 'Vooraf overschrijven',
    }
    return methods[method] || method
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 to-red-50">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white border-2 border-red-500 rounded-2xl p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Betaling mislukt</h2>
            <p className="text-xl text-slate-600 mb-8">
              Er ging iets mis met je betaling. Je kunt het opnieuw proberen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/checkout">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg">
                  Opnieuw proberen
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-6 text-lg font-semibold rounded-lg shadow-md">
                  Neem contact op
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto max-w-4xl">
        {/* Success Header */}
        <div className="bg-white border-2 border-green-500 rounded-2xl p-8 text-center shadow-xl mb-6 animate-fadeInUp">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-slate-900">
            {paymentStatus === 'success' ? 'Betaling geslaagd!' : 'Bestelling ontvangen!'}
          </h1>
          <p className="text-lg text-slate-600">
            {paymentStatus === 'success' 
              ? 'Je betaling is succesvol verwerkt. Bedankt voor je vertrouwen!'
              : 'We verwerken je betaling. Je ontvangt een bevestiging zodra de betaling is voltooid.'
            }
          </p>
        </div>

        {demo && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-amber-800 font-semibold">
              ⚠️ Dit is een demo-betaling. Er is geen echte betaling verwerkt.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Number Card */}
            <Card className="shadow-lg">
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Bestelling Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white mb-6">
                  <p className="text-sm opacity-90 mb-1">Bestelnummer</p>
                  <p className="text-3xl font-bold tracking-wide">{orderData?.orderNumber || 'Laden...'}</p>
                </div>

                {/* Order Items */}
                {orderData?.items && orderData.items.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-900 mb-3">Bestelde diensten:</h3>
                    {orderData.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{item.serviceName}</p>
                          <p className="text-sm text-slate-600">Aantal: {item.quantity}</p>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">€{item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                <div className="mt-6 pt-6 border-t-2 border-slate-200">
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold text-slate-900">Totaal</p>
                    <p className="text-2xl font-bold text-blue-600">
                      €{orderData?.totalAmount ? orderData.totalAmount.toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {orderData?.notes && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-semibold text-amber-900 mb-1">Jouw opmerking:</p>
                    <p className="text-sm text-amber-800">{orderData.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline - What happens next */}
            <Card className="shadow-lg">
              <CardHeader className="bg-green-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Volgende stappen
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Bestelling ontvangen</p>
                      <p className="text-sm text-slate-600">Je bestelling is succesvol geplaatst</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Email bevestiging</p>
                      <p className="text-sm text-slate-600">Je ontvangt een bevestiging op {orderData?.customerEmail || 'je email'}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Contact opnemen</p>
                      <p className="text-sm text-slate-600">We nemen binnen 24 uur contact met je op</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Afspraak inplannen</p>
                      <p className="text-sm text-slate-600">We plannen samen een geschikt moment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment & Actions - Right Column */}
          <div className="space-y-6">
            {/* Payment Info Card */}
            <Card className="shadow-lg">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-slate-600" />
                  Betaling
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Betaalmethode</p>
                  <p className="font-semibold text-slate-900">
                    {orderData?.paymentMethod ? getPaymentMethodName(orderData.paymentMethod) : 'Laden...'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      paymentStatus === 'success' ? 'bg-green-500' : 
                      paymentStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <p className="font-semibold text-slate-900 capitalize">
                      {paymentStatus === 'success' ? 'Betaald' : 
                       paymentStatus === 'pending' ? 'In behandeling' : 'Mislukt'}
                    </p>
                  </div>
                </div>
                {orderData?.createdAt && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Datum</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(orderData.createdAt).toLocaleDateString('nl-BE', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="shadow-lg">
              <CardContent className="pt-6 space-y-3">
                <Button 
                  onClick={handlePrint}
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 border-2 border-slate-300 hover:bg-slate-50"
                >
                  <Printer className="h-4 w-4" />
                  Print bevestiging
                </Button>
                <Link href="/dashboard" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Naar Dashboard
                  </Button>
                </Link>
                <Link href="/diensten" className="block">
                  <Button variant="outline" className="w-full border-2 border-slate-300 hover:bg-slate-50">
                    Meer diensten bekijken
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-slate-900 mb-3">Vragen?</h3>
                <p className="text-sm text-slate-700 mb-4">
                  Neem gerust contact met ons op als je vragen hebt over je bestelling.
                </p>
                <div className="space-y-2 text-sm">
                  <a href="tel:+32484522662" className="flex items-center gap-2 text-blue-700 hover:text-blue-800">
                    <Phone className="h-4 w-4" />
                    +32 484 52 26 62
                  </a>
                  <a href="mailto:info@koubyte.be" className="flex items-center gap-2 text-blue-700 hover:text-blue-800">
                    <Mail className="h-4 w-4" />
                    info@koubyte.be
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

