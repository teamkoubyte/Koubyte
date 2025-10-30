'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Package, Euro, Calendar, User, Phone, Mail, AlertCircle, Trash2, X } from 'lucide-react'
import { format } from 'date-fns'
import { nlBE } from 'date-fns/locale'

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  status: string
  paymentStatus: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  notes: string | null
  createdAt: string
  items: Array<{
    id: string
    serviceName: string
    price: number
    quantity: number
  }>
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, revenue: 0 })
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; orderId: string; orderNumber: string }>({
    show: false,
    orderId: '',
    orderNumber: '',
  })
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/orders')
      if (!response.ok) {
        throw new Error('Fout bij ophalen bestellingen')
      }
      const data = await response.json()
      setOrders(data.orders)
      setStats(data.stats)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })
      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, paymentStatus }),
      })
      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating payment:', error)
    }
  }

  const handleDeleteClick = (orderId: string, orderNumber: string) => {
    setDeleteConfirm({ show: true, orderId, orderNumber })
  }

  const confirmDelete = async () => {
    if (!deleteConfirm.orderId) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/orders?id=${deleteConfirm.orderId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchOrders()
        setDeleteConfirm({ show: false, orderId: '', orderNumber: '' })
        showToast('Bestelling verwijderd', 'success')
      } else {
        const data = await response.json()
        showToast('Fout bij verwijderen: ' + (data.error || 'Onbekende fout'), 'error')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      showToast('Er ging iets mis bij het verwijderen van de bestelling', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, orderId: '', orderNumber: '' })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <>
      {toast && (
        <div className={`fixed top-4 right-4 z-[100000] border-2 rounded-lg shadow-2xl p-4 min-w-[280px] max-w-md animate-slideInRight ${
          toast.type === 'success' ? 'bg-green-50 border-green-500 text-green-900' : toast.type === 'error' ? 'bg-red-50 border-red-500 text-red-900' : 'bg-blue-50 border-blue-500 text-blue-900'
        }`}>
          <div className="flex items-start gap-3">
            <span className="font-semibold flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">×</button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={cancelDelete}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fadeInUp">
            <button
              onClick={cancelDelete}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Bestelling Verwijderen</h3>
                <p className="text-slate-600">Deze actie kan niet ongedaan worden gemaakt</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-slate-600 mb-2">Je staat op het punt om deze bestelling te verwijderen:</p>
              <p className="text-lg font-bold text-slate-900">{deleteConfirm.orderNumber}</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={cancelDelete}
                variant="outline"
                className="flex-1"
                disabled={deleting}
              >
                Annuleer
              </Button>
              <Button
                onClick={confirmDelete}
                variant="destructive"
                className="flex-1"
                disabled={deleting}
              >
                {deleting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verwijderen...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Ja, Verwijder
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-7xl py-6 sm:py-8 px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 lg:mb-8">Bestellingen Beheer</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base text-blue-800 flex items-center gap-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              Totaal Bestellingen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base text-orange-800">In Behandeling</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-900">{stats.pending}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base text-green-800">Afgerond</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900">{stats.completed}</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base text-purple-800 flex items-center gap-2">
              <Euro className="w-4 h-4 sm:w-5 sm:h-5" />
              Totale Omzet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-900">€{stats.revenue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 && (
          <p className="text-center text-slate-600 text-lg py-12">Nog geen bestellingen.</p>
        )}

        {orders.map((order) => {
          const statusColors = {
            pending: 'bg-orange-100 text-orange-800 border-orange-300',
            confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
            in_progress: 'bg-purple-100 text-purple-800 border-purple-300',
            completed: 'bg-green-100 text-green-800 border-green-300',
            cancelled: 'bg-red-100 text-red-800 border-red-300',
          }

          const paymentColors = {
            unpaid: 'bg-red-100 text-red-800 border-red-300',
            paid: 'bg-green-100 text-green-800 border-green-300',
            refunded: 'bg-slate-100 text-slate-800 border-slate-300',
          }

          return (
            <Card key={order.id} className="border-2">
              <CardHeader className="bg-slate-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900">
                      {order.orderNumber}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      {format(new Date(order.createdAt), 'dd MMMM yyyy - HH:mm', { locale: nlBE })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold border-2 ${statusColors[order.status as keyof typeof statusColors] || 'bg-slate-100'}`}>
                      {order.status}
                    </span>
                    <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold border-2 ${paymentColors[order.paymentStatus as keyof typeof paymentColors] || 'bg-slate-100'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Klant Informatie
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Naam:</span> {order.customerName}</p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {order.customerEmail}
                      </p>
                      {order.customerPhone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {order.customerPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3">Bestelde Diensten</h3>
                    <ul className="space-y-2">
                      {order.items.map((item) => (
                        <li key={item.id} className="text-sm flex justify-between">
                          <span>{item.quantity}x {item.serviceName}</span>
                          <span className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t-2 flex justify-between font-bold text-lg">
                      <span>Totaal:</span>
                      <span className="text-blue-600">€{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Opmerkingen:</h4>
                    <p className="text-slate-700">{order.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-4">
                  <div className="w-full sm:flex-1 sm:min-w-[180px]">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-2">Bestelling Status:</label>
                    <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                      <SelectTrigger className="w-full text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full sm:flex-1 sm:min-w-[180px]">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-2">Betaling Status:</label>
                    <Select value={order.paymentStatus} onValueChange={(value) => updatePaymentStatus(order.id, value)}>
                      <SelectTrigger className="w-full text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full sm:w-auto">
                    <Button
                      onClick={() => handleDeleteClick(order.id, order.orderNumber)}
                      variant="destructive"
                      className="w-full sm:w-auto flex items-center gap-2 text-sm sm:text-base py-2 sm:py-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Verwijder Bestelling</span>
                      <span className="sm:hidden">Verwijder</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      </div>
    </>
  )
}

