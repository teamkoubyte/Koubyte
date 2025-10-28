'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const demo = searchParams.get('demo')
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'failed'>('pending')
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    if (!orderId) {
      router.push('/checkout')
      return
    }

    // Check payment status
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const data = await response.json()
          setOrderNumber(data.orderNumber)
          
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
    <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white border-2 border-green-500 rounded-2xl p-12 text-center shadow-2xl animate-fadeInUp">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-slate-900">
            {paymentStatus === 'success' ? 'Betaling geslaagd!' : 'Bestelling ontvangen!'}
          </h2>
          {orderNumber && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-sm text-slate-600 mb-2">Je bestelnummer:</p>
              <p className="text-3xl font-bold text-blue-600">{orderNumber}</p>
            </div>
          )}
          {demo && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800 font-semibold">
                Dit is een demo-betaling. Er is geen echte betaling verwerkt.
              </p>
            </div>
          )}
          <p className="text-xl text-slate-600 mb-8">
            {paymentStatus === 'success' 
              ? 'Je betaling is succesvol verwerkt. We nemen zo snel mogelijk contact met je op om een afspraak in te plannen.'
              : 'We verwerken je betaling. Je ontvangt een bevestiging zodra de betaling is voltooid.'
            }
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

