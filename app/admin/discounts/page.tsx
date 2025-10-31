'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tag, Plus, Edit2, Trash2, Loader2 } from 'lucide-react'

interface DiscountCode {
  id: string
  code: string
  description: string | null
  type: string
  value: number
  minAmount: number | null
  maxUses: number | null
  usedCount: number
  validFrom: string
  validUntil: string | null
  active: boolean
  createdAt: string
}

export const dynamic = 'force-dynamic'
export default function AdminDiscountsPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: '',
    minAmount: '',
    maxUses: '',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
    active: true,
  })

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchCodes = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.append('active', filter === 'active' ? 'true' : 'false')
      }

      const response = await fetch(`/api/admin/discounts?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setCodes(data.codes)
      }
    } catch (error) {
      console.error('Error fetching discount codes:', error)
      showToast('Fout bij ophalen kortingscodes', 'error')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchCodes()
  }, [fetchCodes])

  const openModal = (code?: DiscountCode) => {
    if (code) {
      setEditingCode(code)
      setFormData({
        code: code.code,
        description: code.description || '',
        type: code.type,
        value: code.value.toString(),
        minAmount: code.minAmount?.toString() || '',
        maxUses: code.maxUses?.toString() || '',
        validFrom: new Date(code.validFrom).toISOString().split('T')[0],
        validUntil: code.validUntil ? new Date(code.validUntil).toISOString().split('T')[0] : '',
        active: code.active,
      })
    } else {
      setEditingCode(null)
      setFormData({
        code: '',
        description: '',
        type: 'percentage',
        value: '',
        minAmount: '',
        maxUses: '',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        active: true,
      })
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingCode(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingCode
        ? '/api/admin/discounts'
        : '/api/admin/discounts'
      const method = editingCode ? 'PATCH' : 'POST'

      const payload = {
        ...(editingCode && { id: editingCode.id }),
        code: formData.code,
        description: formData.description || null,
        type: formData.type,
        value: parseFloat(formData.value),
        minAmount: formData.minAmount ? parseFloat(formData.minAmount) : null,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil || null,
        active: formData.active,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        showToast(editingCode ? 'Kortingscode bijgewerkt!' : 'Kortingscode aangemaakt!', 'success')
        fetchCodes()
        closeModal()
      } else {
        showToast(data.error || 'Er is een fout opgetreden', 'error')
      }
    } catch (error) {
      console.error('Error saving discount code:', error)
      showToast('Er is een fout opgetreden', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/discounts?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        showToast(data.message || 'Kortingscode verwijderd', 'success')
        fetchCodes()
        setDeleteConfirm(null)
      } else {
        showToast(data.error || 'Er is een fout opgetreden', 'error')
      }
    } catch (error) {
      console.error('Error deleting discount code:', error)
      showToast('Er is een fout opgetreden', 'error')
    }
  }

  const getStatusColor = (code: DiscountCode) => {
    const now = new Date()
    const validFrom = new Date(code.validFrom)
    const validUntil = code.validUntil ? new Date(code.validUntil) : null

    if (!code.active) {
      return 'bg-slate-100 text-slate-700 border-slate-300'
    }
    if (validFrom > now) {
      return 'bg-blue-100 text-blue-700 border-blue-300'
    }
    if (validUntil && validUntil < now) {
      return 'bg-red-100 text-red-700 border-red-300'
    }
    if (code.maxUses && code.usedCount >= code.maxUses) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    }
    return 'bg-green-100 text-green-700 border-green-300'
  }

  const getStatusText = (code: DiscountCode) => {
    const now = new Date()
    const validFrom = new Date(code.validFrom)
    const validUntil = code.validUntil ? new Date(code.validUntil) : null

    if (!code.active) {
      return 'Inactief'
    }
    if (validFrom > now) {
      return 'Nog niet geldig'
    }
    if (validUntil && validUntil < now) {
      return 'Verlopen'
    }
    if (code.maxUses && code.usedCount >= code.maxUses) {
      return 'Op'
    }
    return 'Actief'
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-3 sm:px-4 w-full overflow-x-hidden">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100000] border-2 rounded-lg shadow-2xl p-4 min-w-[280px] max-w-md animate-slideInRight ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-900'
              : 'bg-red-50 border-red-500 text-red-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="font-semibold flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">
              ×
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Kortingscodes</h1>
            <p className="text-slate-600">Beheer kortingscodes en promoties</p>
          </div>
          <Button onClick={() => openModal()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe kortingscode
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="text-sm"
          >
            Alle
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
            className="text-sm"
          >
            Actief
          </Button>
          <Button
            variant={filter === 'inactive' ? 'default' : 'outline'}
            onClick={() => setFilter('inactive')}
            className="text-sm"
          >
            Inactief
          </Button>
        </div>
      </div>

      {/* Codes Grid */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-slate-600">Kortingscodes laden...</p>
        </div>
      ) : codes.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Tag className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600 mb-4">Geen kortingscodes gevonden.</p>
            <Button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Maak eerste kortingscode
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {codes.map((code) => (
            <Card key={code.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-xl font-bold">{code.code}</CardTitle>
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(code)}`}>
                      {getStatusText(code)}
                    </span>
                  </div>
                </div>
                {code.description && (
                  <CardDescription className="mt-2">{code.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium">
                      {code.type === 'percentage' ? `${code.value}%` : `€${code.value.toFixed(2)}`}
                    </span>
                  </div>
                  {code.minAmount && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Min. bedrag:</span>
                      <span className="font-medium">€{code.minAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {code.maxUses && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Gebruikt:</span>
                      <span className="font-medium">
                        {code.usedCount} / {code.maxUses}
                      </span>
                    </div>
                  )}
                  {!code.maxUses && code.usedCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Gebruikt:</span>
                      <span className="font-medium">{code.usedCount}x</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Geldig van:</span>
                    <span className="font-medium">
                      {new Date(code.validFrom).toLocaleDateString('nl-BE')}
                    </span>
                  </div>
                  {code.validUntil && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Geldig tot:</span>
                      <span className="font-medium">
                        {new Date(code.validUntil).toLocaleDateString('nl-BE')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal(code)}
                    className="flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Bewerken
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirm(code.id)}
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Verwijder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingCode ? 'Bewerk kortingscode' : 'Nieuwe kortingscode'}</CardTitle>
              <CardDescription>Vul de gegevens in voor de kortingscode</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    placeholder="WELCOME10"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Beschrijving</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="10% korting voor nieuwe klanten"
                    className="mt-2"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Vast bedrag</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="value">Waarde *</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      required
                      placeholder={formData.type === 'percentage' ? '10' : '5.00'}
                      className="mt-2"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {formData.type === 'percentage' ? 'Percentage (bijv. 10 voor 10%)' : 'Bedrag in EUR'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minAmount">Minimum bedrag (optioneel)</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      step="0.01"
                      value={formData.minAmount}
                      onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                      placeholder="0.00"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxUses">Maximum gebruik (optioneel)</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      value={formData.maxUses}
                      onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                      placeholder="100"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="validFrom">Geldig vanaf *</Label>
                    <Input
                      id="validFrom"
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="validUntil">Geldig tot (optioneel)</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
                  />
                  <Label htmlFor="active" className="cursor-pointer">
                    Actief
                  </Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    {editingCode ? 'Bijwerken' : 'Aanmaken'}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                    Annuleren
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Kortingscode verwijderen?</CardTitle>
              <CardDescription>Deze actie kan niet ongedaan worden gemaakt.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1"
                >
                  Annuleren
                </Button>
                <Button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Verwijderen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

