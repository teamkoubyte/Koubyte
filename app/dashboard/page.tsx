'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Wrench, AlertCircle, CheckCircle } from 'lucide-react'
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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated' && session) {
      fetchAppointments()
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

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto max-w-6xl py-16 px-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
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
                <p className="text-sm text-slate-600">Geplande afspraken</p>
                <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
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
    </div>
  )
}

