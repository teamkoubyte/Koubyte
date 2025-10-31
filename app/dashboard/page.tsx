'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Wrench, AlertCircle, CheckCircle, Package, DollarSign, Download, Star, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'
// formatDate utility verwijderd - we gebruiken inline formatting

interface Appointment {
  id: string
  date: string
  time: string
  service: string
  description: string
  status: string
}

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  finalAmount?: number
  status: string
  paymentStatus: string
  createdAt: string
  items: {
    serviceName: string
    quantity: number
    price: number
  }[]
}

interface Payment {
  id: string
  amount: number
  currency: string
  provider: string
  method: string
  status: string
  createdAt: string
  orderId?: string
  order?: {
    orderNumber: string
  }
}

interface Review {
  id: string
  rating: number
  comment: string
  service: string | null
  approved: boolean
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated' && session) {
      fetchAppointments()
      fetchOrders()
      fetchPayments()
      fetchReviews()
    }
  }, [status, session, router])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data.appointments || [])
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments/user')
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setPaymentsLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews/user')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto max-w-6xl py-16 px-3 sm:px-4 w-full overflow-x-hidden">
        <p>Laden...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const pendingAppointments = appointments.filter(a => a.status === 'pending')
  const upcomingAppointments = appointments.filter(a => ['pending', 'confirmed'].includes(a.status))

  return (
    <div className="container mx-auto max-w-6xl py-12 sm:py-16 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welkom terug, {session.user?.name}!</h1>
        <p className="text-slate-600">Bekijk je afspraken en beheer je account.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Totaal afspraken</p>
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">In behandeling</p>
                <p className="text-2xl font-bold">{pendingAppointments.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Aankomend</p>
                <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Totaal bestellingen</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GDPR Privacy Link */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Privacy & Gegevens</h3>
              <p className="text-sm text-slate-600">Beheer je persoonlijke gegevens, download je data of verwijder je account</p>
            </div>
            <Link href="/dashboard/privacy">
              <Button variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-100">
                Beheer Privacy
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold">Mijn afspraken</h2>
          <Link href="/book">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              Nieuwe afspraak
            </Button>
          </Link>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 mb-4">Je hebt nog geen afspraken.</p>
              <Link href="/book">
                <Button>Boek je eerste afspraak</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-2">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-semibold">{appointment.service}</h3>
                          <p className="text-sm text-slate-600">{appointment.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 ml-9">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.time}
                        </div>
                        <span>{new Date(appointment.date).toLocaleDateString('nl-BE', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    <div className="md:text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status === 'completed' && 'Afgerond'}
                        {appointment.status === 'confirmed' && 'Bevestigd'}
                        {appointment.status === 'pending' && 'In behandeling'}
                        {appointment.status === 'cancelled' && 'Geannuleerd'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Mijn Reviews */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold">Mijn Reviews</h2>
          <Link href="/review">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              Nieuwe review
            </Button>
          </Link>
        </div>

        {reviewsLoading ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600">Reviews laden...</p>
            </CardContent>
          </Card>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 mb-4">Je hebt nog geen reviews geschreven.</p>
              <Link href="/review">
                <Button>Schrijf je eerste review</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-2">
                        <Star className="h-5 w-5 text-yellow-500 mt-0.5 fill-yellow-500" />
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {review.service || 'Dienst'}
                            <span className="text-sm font-normal text-slate-500">
                              ({review.rating}/5)
                            </span>
                          </h3>
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{review.comment}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 ml-9">
                        <span>
                          {new Date(review.createdAt).toLocaleDateString('nl-BE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            review.approved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {review.approved ? 'Goedgekeurd' : 'In afwachting'}
                        </span>
                      </div>
                    </div>
                    <div className="md:text-right flex flex-col gap-2">
                      <Link href={`/review/edit/${review.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full md:w-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Bewerken
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Mijn Bestellingen */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold">Mijn Bestellingen</h2>
          <Link href="/diensten">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
              Nieuwe bestelling
            </Button>
          </Link>
        </div>

        {ordersLoading ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600">Bestellingen laden...</p>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 mb-4">Je hebt nog geen bestellingen.</p>
              <Link href="/diensten">
                <Button>Bekijk diensten</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-2">
                        <Package className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <h3 className="font-semibold">Bestelling {order.orderNumber}</h3>
                          <p className="text-sm text-slate-600">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 ml-9">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          €{(order.finalAmount || order.totalAmount).toFixed(2).replace('.', ',')}
                        </div>
                        <span>
                          {new Date(order.createdAt).toLocaleDateString('nl-BE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="ml-9 mt-2">
                        <div className="text-xs text-slate-500">
                          {order.items.map((item, idx) => (
                            <span key={idx}>
                              {item.quantity}x {item.serviceName}
                              {idx < order.items.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="md:text-right flex flex-col gap-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status === 'completed' && 'Afgerond'}
                        {order.status === 'confirmed' && 'Bevestigd'}
                        {order.status === 'pending' && 'In behandeling'}
                        {order.status === 'cancelled' && 'Geannuleerd'}
                      </span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          order.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : order.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.paymentStatus === 'paid' && 'Betaald'}
                        {order.paymentStatus === 'pending' && 'Betaling pending'}
                        {order.paymentStatus === 'unpaid' && 'Niet betaald'}
                        {order.paymentStatus === 'refunded' && 'Terugbetaald'}
                      </span>
                      {order.paymentStatus === 'paid' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => window.open(`/api/orders/${order.id}/invoice`, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Factuur
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

