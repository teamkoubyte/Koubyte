'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ALL_TIME_SLOTS: string[] = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
]

const SERVICES = [
  'Diagnose & Advies',
  'PC of laptop reinigen',
  'RAM uitbreiden',
  'SSD of HDD vervangen',
  'Virus & malware verwijderen',
  'Windows herinstalleren',
  'PC optimaliseren & versnellen',
  'Software installeren & instellen',
  'WiFi instellen & optimaliseren',
  'Netwerk installatie',
  'Data overzetten',
  'Backup oplossing instellen',
  'Dataherstel',
  'Jaarlijkse onderhoudsbeurt',
  'Remote hulp',
  'Anders',
]

export const dynamic = 'force-dynamic'

export default function BookPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    description: '',
  })

  const [availableSlots, setAvailableSlots] = useState<string[]>(ALL_TIME_SLOTS)
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  const checkAvailability = useCallback(async (date: string) => {
    setCheckingAvailability(true)
    try {
      const response = await fetch(`/api/appointments/availability?date=${date}`)
      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data.availableSlots || ALL_TIME_SLOTS)
      } else {
        setAvailableSlots(ALL_TIME_SLOTS)
      }
    } catch {
      setAvailableSlots(ALL_TIME_SLOTS)
    } finally {
      setCheckingAvailability(false)
    }
  }, [])

  useEffect(() => {
    if (formData.date) {
      checkAvailability(formData.date)
    } else {
      setAvailableSlots(ALL_TIME_SLOTS)
    }
  }, [formData.date, checkAvailability])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.conflict
          ? `${data.error || 'Dit tijdslot is al bezet.'} Kies een andere datum of tijd.`
          : data.error || 'Kon de afspraak niet aanmaken. Probeer het opnieuw.'
        )
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/'), 3000)
      }
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw of neem telefonisch contact op.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl border-2 border-blue-200 p-10 text-center shadow-xl">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Afspraak aangemaakt!</h2>
          <p className="text-slate-600 mb-1">Ik neem zo snel mogelijk contact met je op ter bevestiging.</p>
          <p className="text-sm text-slate-400">Je wordt over enkele seconden doorgestuurd...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-x-hidden w-full">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-14 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Afspraak maken</h1>
          <p className="text-lg text-slate-600">
            Kies een datum en tijdstip dat voor jou past. Ik bevestig zo snel mogelijk.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-2xl">

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 mb-6 flex gap-3">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-700 space-y-1">
              <p><strong>Gratis annuleren</strong> tot 24 uur voor de afspraak.</p>
              <p>Binnen 24 uur: 50% van de prijs. Na aanvang: volledige prijs.</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Boek je afspraak</CardTitle>
              <CardDescription>
                Ik neem zo snel mogelijk contact op ter bevestiging.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">Naam *</Label>
                    <Input
                      id="name"
                      className="mt-1"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefoon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      className="mt-1"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-1"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="date">Datum *</Label>
                    <Input
                      id="date"
                      type="date"
                      className="mt-1"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Tijdstip *</Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) => setFormData({ ...formData, time: value })}
                      disabled={!formData.date || checkingAvailability}
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder={
                          checkingAvailability ? 'Controleren...' :
                          !formData.date ? 'Kies eerst datum' : 'Kies tijdstip'
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                        {availableSlots.length === 0 && (
                          <SelectItem value="" disabled>Geen tijdslots beschikbaar</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {checkingAvailability && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Beschikbaarheid controleren...
                      </p>
                    )}
                    {formData.date && !checkingAvailability && availableSlots.length === 0 && (
                      <p className="text-xs text-red-600 mt-1">Deze dag is volgeboekt. Kies een andere datum.</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="service">Type dienst *</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Selecteer dienst" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Omschrijf je probleem *</Label>
                  <Textarea
                    id="description"
                    className="mt-1"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Beschrijf zo duidelijk mogelijk wat er mis is of wat je nodig hebt..."
                    rows={4}
                    required
                  />
                </div>

                {/* GDPR */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedPrivacy}
                      onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                      required
                      className="mt-1 w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-slate-700">
                      Ik ga akkoord met het{' '}
                      <a href="/privacy" target="_blank" className="text-blue-600 underline font-medium">privacybeleid</a>{' '}
                      en geef toestemming om mijn gegevens te verwerken voor deze afspraak. *
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      required
                      className="mt-1 w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-slate-700">
                      Ik heb de{' '}
                      <a href="/terms" target="_blank" className="text-blue-600 underline font-medium">algemene voorwaarden</a>{' '}
                      gelezen en ga akkoord, inclusief het annuleringsbeleid. *
                    </span>
                  </label>
                </div>

                {/* Garantie */}
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    <strong>3 maanden garantie</strong> op alle uitgevoerde herstellingen.
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full py-5 sm:py-6 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                  disabled={loading || !acceptedPrivacy || !acceptedTerms}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Afspraak aanmaken...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Afspraak bevestigen
                    </span>
                  )}
                </Button>

                <p className="text-center text-xs text-slate-400">* Verplichte velden</p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
