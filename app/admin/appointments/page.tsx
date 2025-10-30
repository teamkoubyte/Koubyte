'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Mail, Phone, Trash2, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Appointment {
  id: string
  userId: string
  date: string
  time: string
  service: string
  description: string
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [filter])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const url = filter === 'all' 
        ? '/api/admin/appointments' 
        : `/api/admin/appointments?status=${filter}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdating(id)
      const response = await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })

      if (response.ok) {
        fetchAppointments()
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
    } finally {
      setUpdating(null)
    }
  }

  const deleteAppointment = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze afspraak wilt verwijderen?')) return

    try {
      setUpdating(id)
      const response = await fetch(`/api/admin/appointments?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchAppointments()
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const statusOptions = [
    { value: 'pending', label: 'In Behandeling' },
    { value: 'confirmed', label: 'Bevestigd' },
    { value: 'completed', label: 'Voltooid' },
    { value: 'cancelled', label: 'Geannuleerd' },
  ]

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">Afspraken Beheer</h1>
        <p className="text-slate-600 text-sm sm:text-base">Bekijk en beheer alle afspraken</p>
      </div>

      {/* Filter Knoppen */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 ${filter === 'all' ? 'bg-blue-600 text-white' : ''}`}
        >
          Alle ({appointments.length})
        </Button>
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            onClick={() => setFilter(option.value)}
            variant={filter === option.value ? 'default' : 'outline'}
            className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 ${filter === option.value ? 'bg-blue-600 text-white' : ''}`}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Afspraken Lijst */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Geen afspraken gevonden</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Afspraak Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {statusOptions.find(s => s.value === appointment.status)?.label || appointment.status}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500">
                        {new Date(appointment.createdAt).toLocaleDateString('nl-BE')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-slate-700">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold">{appointment.user.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{appointment.user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{new Date(appointment.date).toLocaleDateString('nl-BE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="font-semibold text-slate-900 mb-1">{appointment.service}</div>
                      {appointment.description && (
                        <p className="text-sm text-slate-600">{appointment.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Acties */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto lg:min-w-[140px]">
                    {appointment.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => updateStatus(appointment.id, 'confirmed')}
                          disabled={updating === appointment.id}
                          className="w-full sm:w-auto lg:w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2 sm:py-2"
                        >
                          {updating === appointment.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                          Bevestig
                        </Button>
                        <Button
                          onClick={() => updateStatus(appointment.id, 'cancelled')}
                          disabled={updating === appointment.id}
                          variant="outline"
                          className="w-full sm:w-auto lg:w-full border-red-300 text-red-600 hover:bg-red-50 text-sm sm:text-base py-2 sm:py-2"
                        >
                          Annuleer
                        </Button>
                      </>
                    )}
                    {appointment.status === 'confirmed' && (
                      <Button
                        onClick={() => updateStatus(appointment.id, 'completed')}
                        disabled={updating === appointment.id}
                        className="w-full sm:w-auto lg:w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-2 sm:py-2"
                      >
                        {updating === appointment.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                        Voltooi
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteAppointment(appointment.id)}
                      disabled={updating === appointment.id}
                      variant="outline"
                      className="w-full sm:w-auto lg:w-full border-red-300 text-red-600 hover:bg-red-50 text-sm sm:text-base py-2 sm:py-2"
                    >
                      {updating === appointment.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      {appointment.status !== 'pending' && appointment.status !== 'confirmed' && <span className="ml-2">Verwijder</span>}
                    </Button>
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
