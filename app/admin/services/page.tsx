'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Check,
  Star,
  Loader2,
  Package
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string | null
  category: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

const categories = [
  'Webdesign',
  'IT Support',
  'Netwerk',
  'Software',
  'Onderhoud',
  'Consultancy',
  'Training',
  'Beveiliging',
]

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    featured: false,
  })

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      showToast('Fout bij ophalen services', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration || '',
        category: service.category,
        featured: service.featured,
      })
    } else {
      setEditingService(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: '',
        featured: false,
      })
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingService(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      featured: false,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingService 
        ? `/api/services/${editingService.id}`
        : '/api/services'
      
      const method = editingService ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        showToast(data.message, 'success')
        fetchServices()
        closeModal()
      } else {
        showToast(data.error || 'Er is een fout opgetreden', 'error')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      showToast('Fout bij opslaan service', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        showToast(data.message, 'success')
        fetchServices()
        setDeleteConfirm(null)
      } else {
        showToast(data.error || 'Er is een fout opgetreden', 'error')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      showToast('Fout bij verwijderen service', 'error')
    }
  }

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2).replace('.', ',')}`
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

      {/* Header - RESPONSIVE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Services Beheer</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Beheer alle diensten die je aanbiedt</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Nieuwe Service</span>
          <span className="sm:hidden">Nieuw</span>
        </Button>
      </div>

      {/* Services Grid - RESPONSIVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {services.map((service) => (
          <Card key={service.id} className="relative">
            {service.featured && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Star className="w-3 h-3 fill-yellow-900" />
                Featured
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <span className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                      {service.category}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 line-clamp-3">{service.description}</p>
              
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-600">{formatPrice(service.price)}</span>
                {service.duration && (
                  <span className="text-sm text-slate-600">/ {service.duration}</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button
                  onClick={() => openModal(service)}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Bewerken</span>
                  <span className="sm:hidden">Edit</span>
                </Button>
                <Button
                  onClick={() => setDeleteConfirm(service.id)}
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Verwijderen</span>
                  <span className="sm:hidden">Delete</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <Package className="w-16 h-16 mx-auto text-slate-300" />
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Geen services</h3>
              <p className="text-slate-600 mb-6">Begin met het toevoegen van je eerste service</p>
              <Button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                Voeg Service Toe
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Modal - RESPONSIVE */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {editingService ? 'Service Bewerken' : 'Nieuwe Service'}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Service Naam *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Bijv: Website Ontwikkeling"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Beschrijving *</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Uitgebreide beschrijving van de service..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prijs (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="99.99"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duur (optioneel)</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Bijv: 2-3 weken"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Categorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer categorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured service (toon op homepage)
                  </Label>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="flex-1"
                    disabled={submitting}
                  >
                    Annuleren
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Opslaan...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        {editingService ? 'Bijwerken' : 'Aanmaken'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl">Service Verwijderen?</CardTitle>
              <CardDescription>
                Weet je zeker dat je deze service wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1"
                >
                  Annuleren
                </Button>
                <Button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
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

