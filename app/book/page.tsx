'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BookPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    date: '',
    time: '',
    service: '',
    description: '',
  })

  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  const services = [
    'Hardware reparatie',
    'Software installatie',
    'Netwerk problemen',
    'Virus verwijderen',
    'Systeem onderhoud',
    'Dataherstel',
    'Configuratie',
    'Upgrade',
    'Anders',
  ]

  const allTimeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
  ]

  const checkAvailability = useCallback(async (date: string) => {
    setCheckingAvailability(true)
    try {
      const response = await fetch(`/api/appointments/availability?date=${date}`)
      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data.availableSlots || allTimeSlots)
      } else {
        // Fallback naar alle slots als API faalt
        setAvailableSlots(allTimeSlots)
      }
    } catch (error) {
      console.error('Error checking availability:', error)
      setAvailableSlots(allTimeSlots)
    } finally {
      setCheckingAvailability(false)
    }
  }, [])

  // Check beschikbaarheid wanneer datum wordt geselecteerd
  useEffect(() => {
    if (formData.date) {
      checkAvailability(formData.date)
    } else {
      setAvailableSlots(allTimeSlots)
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
        if (data.conflict) {
          setError(`${data.error || 'Dit tijdslot is al bezet.'} Kies een andere datum of tijd.`)
        } else {
          setError(data.error || 'Kon afspraak niet maken')
        }
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error) {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container mx-auto max-w-2xl py-12 sm:py-16 px-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-green-800">Afspraak aangemaakt!</h2>
            <p className="text-sm sm:text-base text-green-700">Je wordt doorgestuurd naar je dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 sm:py-16 px-4">
      {/* Annuleringsbeleid - Zoals vermeld in Algemene Voorwaarden */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Annuleringsbeleid
        </h3>
        <div className="space-y-2 text-sm sm:text-base text-slate-700">
          <p>✓ <strong>Gratis annuleren tot 24 uur</strong> voor de afspraak</p>
          <p>• Binnen 24 uur: 50% van de prijs wordt in rekening gebracht</p>
          <p>• Na aanvang werkzaamheden: volledige prijs verschuldigd</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Afspraak boeken</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Boek een afspraak voor IT-hulp. We nemen zo snel mogelijk contact met je op.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <Label htmlFor="name">Naam *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefoon (optioneel)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="date">Datum *</Label>
              <Input
                id="date"
                type="date"
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    checkingAvailability 
                      ? 'Beschikbaarheid controleren...' 
                      : !formData.date 
                        ? 'Selecteer eerst een datum' 
                        : 'Selecteer tijd'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot} ✓ Beschikbaar
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Geen beschikbare tijdslots
                    </SelectItem>
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
                <p className="text-xs text-red-600 mt-1">Deze dag is volledig volgeboekt. Kies een andere datum.</p>
              )}
              {formData.date && !checkingAvailability && availableSlots.length > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  {availableSlots.length} tijdslot{availableSlots.length !== 1 ? 's' : ''} beschikbaar
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="service">Type dienst *</Label>
              <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecteer dienst" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Beschrijving van het probleem *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beschrijf je probleem zo gedetailleerd mogelijk..."
                rows={4}
                required
              />
            </div>

            {/* GDPR Privacy Acceptatie - Wettelijk Verplicht */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  required
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">
                  Ik ga akkoord met het <a href="/privacy" target="_blank" className="text-blue-600 hover:text-blue-700 font-semibold underline">privacybeleid</a> en geef toestemming om mijn persoons gegevens te verwerken voor het plannen en uitvoeren van de afspraak. *
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">
                  Ik heb de <a href="/terms" target="_blank" className="text-blue-600 hover:text-blue-700 font-semibold underline">algemene voorwaarden</a> gelezen en ga hiermee akkoord, inclusief het annuleringsbeleid. *
                </span>
              </label>
            </div>

            {/* Garantie Informatie - Zoals vermeld in Algemene Voorwaarden */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-slate-700">
              <p className="font-semibold text-green-800 mb-2">✓ 3 maanden garantie</p>
              <p>Op alle uitgevoerde reparaties geldt een garantietermijn van 3 maanden.</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-5 sm:py-6 text-base sm:text-lg" 
              disabled={loading || !acceptedPrivacy || !acceptedTerms}
            >
              {loading ? 'Afspraak aanmaken...' : 'Afspraak bevestigen'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

