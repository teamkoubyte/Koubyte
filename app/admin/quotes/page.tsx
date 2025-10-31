'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  FileText, 
  Loader2, 
  X, 
  Check, 
  Eye,
  Mail,
  Phone,
  Calendar
} from 'lucide-react'

interface Quote {
  id: string
  userId: string | null
  name: string
  email: string
  phone: string | null
  service: string
  description: string
  estimatedPrice: number | null
  status: string
  adminNotes: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  } | null
}

export const dynamic = 'force-dynamic'
export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'sent' | 'accepted' | 'rejected'>('all')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('pending')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchQuotes = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.append('status', filter)
      }

      const response = await fetch(`/api/quotes?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        // Zorg ervoor dat estimatedPrice altijd aanwezig is (kan null zijn)
        const quotes = (data.quotes || []).map((quote: Quote) => ({
          ...quote,
          estimatedPrice: quote.estimatedPrice ?? null,
        }))
        setQuotes(quotes)
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
      showToast('Fout bij ophalen offertes', 'error')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  const openModal = (quote: Quote) => {
    setSelectedQuote(quote)
    setNotes(quote.adminNotes || '')
    setStatus(quote.status)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedQuote(null)
    setNotes('')
    setStatus('pending')
  }

  const handleUpdate = async () => {
    if (!selectedQuote) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/quotes/${selectedQuote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          adminNotes: notes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        showToast('Offerte bijgewerkt', 'success')
        fetchQuotes()
        closeModal()
      } else {
        showToast(data.error || 'Fout bij bijwerken', 'error')
      }
    } catch (error) {
      console.error('Error updating quote:', error)
      showToast('Fout bij bijwerken offerte', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const formatPrice = (price: number | null) => {
    if (!price) return 'Niet opgegeven'
    return `€${price.toFixed(2).replace('.', ',')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-BE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'In behandeling'
      case 'sent':
        return 'Verzonden'
      case 'accepted':
        return 'Geaccepteerd'
      case 'rejected':
        return 'Afgewezen'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slideInRight">
          <div className={`${
            toast.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          } border-2 rounded-lg shadow-2xl p-4 min-w-[300px]`}>
            <div className="flex items-start gap-3">
              {toast.type === 'success' ? (
                <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <X className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <p className={`flex-1 ${
                toast.type === 'success' ? 'text-green-900' : 'text-red-900'
              } font-medium`}>
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Offertes Beheer</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Beheer alle offerte aanvragen</p>
        </div>
      </div>

      {/* Filters */}
      <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
        <SelectTrigger className="w-full sm:w-[250px]">
          <SelectValue placeholder="Filter op status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle offertes</SelectItem>
          <SelectItem value="pending">In behandeling</SelectItem>
          <SelectItem value="sent">Verzonden</SelectItem>
          <SelectItem value="accepted">Geaccepteerd</SelectItem>
          <SelectItem value="rejected">Afgewezen</SelectItem>
        </SelectContent>
      </Select>

      {/* Quotes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {quotes.map((quote) => (
          <Card key={quote.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-2">{quote.service}</CardTitle>
                  <CardDescription className="mt-1 text-sm">{quote.name}</CardDescription>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(quote.status)}`}>
                  {getStatusLabel(quote.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{quote.email}</span>
                </div>
                {quote.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{quote.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(quote.createdAt)}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm font-semibold text-slate-900 mb-1">Geschatte prijs:</p>
                <p className="text-lg font-bold text-blue-600">{quote.estimatedPrice ? formatPrice(quote.estimatedPrice) : 'N/A'}</p>
              </div>

              <p className="text-sm text-slate-600 line-clamp-3">{quote.description}</p>

              <Button
                onClick={() => openModal(quote)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Bekijken & Beheren
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {quotes.length === 0 && (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <FileText className="w-16 h-16 mx-auto text-slate-300" />
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Geen offertes</h3>
              <p className="text-slate-600">Er zijn momenteel geen offerte aanvragen</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      {modalOpen && selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto my-4">
            <CardHeader className="sticky top-0 bg-white z-10 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Offerte Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-semibold text-slate-600">Naam</Label>
                  <p className="mt-1 text-slate-900">{selectedQuote.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-600">Email</Label>
                  <p className="mt-1 text-slate-900">{selectedQuote.email}</p>
                </div>
                {selectedQuote.phone && (
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">Telefoon</Label>
                    <p className="mt-1 text-slate-900">{selectedQuote.phone}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-semibold text-slate-600">Dienst</Label>
                  <p className="mt-1 text-slate-900">{selectedQuote.service}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-600">Geschatte prijs</Label>
                  <p className="mt-1 text-lg font-bold text-blue-600">{selectedQuote.estimatedPrice ? formatPrice(selectedQuote.estimatedPrice) : 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-600">Datum</Label>
                  <p className="mt-1 text-slate-900">{formatDate(selectedQuote.createdAt)}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-600">Beschrijving</Label>
                <p className="mt-2 p-4 bg-slate-50 rounded-lg text-slate-900 whitespace-pre-wrap">
                  {selectedQuote.description}
                </p>
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-semibold">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">In behandeling</SelectItem>
                    <SelectItem value="sent">Verzonden</SelectItem>
                    <SelectItem value="accepted">Geaccepteerd</SelectItem>
                    <SelectItem value="rejected">Afgewezen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-semibold">Admin notities</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-2"
                  placeholder="Interne notities over deze offerte..."
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={closeModal}>
                  Annuleren
                </Button>
                <Button onClick={handleUpdate} disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    'Opslaan'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

