'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, CreditCard, CheckCircle, XCircle, Clock, RefreshCw, Filter, Search, Loader2 } from 'lucide-react'

interface Payment {
  id: string
  userId?: string
  orderId?: string
  amount: number
  currency: string
  provider: string
  method: string
  status: string
  paymentIntentId?: string
  createdAt: string
  updatedAt: string
  order?: {
    orderNumber: string
    customerName: string
    customerEmail: string
  }
  user?: {
    name: string
    email: string
  }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [providerFilter, setProviderFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0,
    completedAmount: 0,
  })

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (providerFilter !== 'all') params.append('provider', providerFilter)

      const response = await fetch(`/api/admin/payments?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, providerFilter])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const handleRefresh = () => {
    fetchPayments()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'refunded':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4" />
      case 'failed':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getProviderLogo = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'stripe':
        return '💳'
      case 'mollie':
        return '🟠'
      case 'paypal':
        return '🔵'
      case 'bancontact':
        return '🏦'
      case 'crypto':
        return '₿'
      default:
        return '💵'
    }
  }

  const filteredPayments = payments.filter((payment) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        payment.orderId?.toLowerCase().includes(search) ||
        payment.order?.orderNumber?.toLowerCase().includes(search) ||
        payment.order?.customerName?.toLowerCase().includes(search) ||
        payment.order?.customerEmail?.toLowerCase().includes(search) ||
        payment.user?.name?.toLowerCase().includes(search) ||
        payment.user?.email?.toLowerCase().includes(search) ||
        payment.paymentIntentId?.toLowerCase().includes(search)
      )
    }
    return true
  })

  return (
    <div className="container mx-auto max-w-7xl py-6 sm:py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
          Betalingen Beheer
        </h1>
        <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Ververs
        </Button>
      </div>

      {/* Statistieken */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="border-2 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Totaal Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              €{stats.completedAmount.toFixed(2).replace('.', ',')}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">
              Van {stats.completed} betaalde betalingen
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Voltooid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Betaalde betalingen</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              In Behandeling
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Pending/Processing</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Mislukt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Gefaalde betalingen</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
                <Search className="w-4 h-4" />
                Zoeken
              </label>
              <input
                type="text"
                placeholder="Zoek op ordernummer, naam, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statussen</SelectItem>
                  <SelectItem value="completed">Voltooid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Mislukt</SelectItem>
                  <SelectItem value="refunded">Terugbetaald</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Provider
              </label>
              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle providers</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="mollie">Mollie</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bancontact">Bancontact</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="sepa">SEPA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </CardContent>
        </Card>
      ) : filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-slate-500">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-semibold mb-2">Geen betalingen gevonden</p>
              <p className="text-sm">Er zijn geen betalingen die voldoen aan de geselecteerde filters</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  {/* Payment Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getProviderLogo(payment.provider)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">
                            €{payment.amount.toFixed(2).replace('.', ',')} {payment.currency}
                          </p>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {getStatusIcon(payment.status)}
                            {payment.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {payment.provider} • {payment.method}
                        </p>
                        {payment.paymentIntentId && (
                          <p className="text-xs text-slate-500 mt-1 font-mono">
                            ID: {payment.paymentIntentId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="lg:col-span-2">
                    {payment.order ? (
                      <div>
                        <p className="font-semibold text-slate-900 text-sm mb-1">
                          Order: {payment.order.orderNumber}
                        </p>
                        <p className="text-sm text-slate-600">{payment.order.customerName}</p>
                        <p className="text-xs text-slate-500">{payment.order.customerEmail}</p>
                      </div>
                    ) : payment.user ? (
                      <div>
                        <p className="font-semibold text-slate-900 text-sm mb-1">{payment.user.name}</p>
                        <p className="text-xs text-slate-500">{payment.user.email}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Geen order info</p>
                    )}
                  </div>

                  {/* Date & Actions */}
                  <div className="lg:col-span-1 text-right">
                    <p className="text-xs text-slate-500 mb-2">
                      {new Date(payment.createdAt).toLocaleDateString('nl-BE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(payment.createdAt).toLocaleTimeString('nl-BE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {payment.orderId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => window.open(`/admin/orders?orderId=${payment.orderId}`, '_blank')}
                      >
                        Bekijk Order
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
  )
}

