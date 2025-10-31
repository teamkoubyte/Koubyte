'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, CheckCircle, MessageSquare, Send, Clock, MapPin, AlertCircle, Loader2, User } from 'lucide-react'
import { openWhatsApp } from '@/lib/utils'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors }

    switch (field) {
      case 'name':
        if (!value) {
          newErrors.name = 'Naam is verplicht'
        } else {
          delete newErrors.name
        }
        break

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value) {
          newErrors.email = 'Email is verplicht'
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Voer een geldig emailadres in'
        } else {
          delete newErrors.email
        }
        break

      case 'subject':
        if (!value) {
          newErrors.subject = 'Onderwerp is verplicht'
        } else {
          delete newErrors.subject
        }
        break

      case 'message':
        if (!value) {
          newErrors.message = 'Bericht is verplicht'
        } else if (value.length < 10) {
          newErrors.message = 'Bericht moet minimaal 10 tekens bevatten'
        } else {
          delete newErrors.message
        }
        break
    }

    setErrors(newErrors)
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      validateField(field, value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all required fields
    const required = ['name', 'email', 'subject', 'message']
    required.forEach((field) => {
      validateField(field, formData[field as keyof typeof formData])
    })

    // Check for errors
    if (Object.keys(errors).length > 0) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setErrors({ general: 'Er ging iets mis. Probeer het opnieuw.' })
      }
    } catch (error) {
      console.error('Fout bij verzenden:', error)
      setErrors({ general: 'Er ging iets mis. Probeer het opnieuw.' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-3 sm:px-4 bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden w-full">
        <div className="container mx-auto max-w-2xl w-full overflow-x-hidden px-3 sm:px-4">
          <div className="bg-white border-2 border-green-500 rounded-2xl p-12 text-center shadow-2xl animate-fadeInUp">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Bericht verzonden!</h2>
            <p className="text-xl text-slate-600 mb-8">
              Bedankt voor je bericht. Ik neem zo snel mogelijk contact met je op, meestal binnen 24 uur.
            </p>
            <Button
              onClick={() => setSuccess(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg"
            >
              Nog een bericht sturen
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Hero Sectie */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 sm:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center w-full overflow-x-hidden px-3 sm:px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-5 sm:mb-6 animate-fadeInDown">
            Neem contact op
          </h1>
          <p className="text-base sm:text-xl text-slate-600 mb-3 sm:mb-4 animate-fadeInUp">
            Heb je een vraag of hulp nodig met je computer?
          </p>
          <p className="text-sm sm:text-lg text-slate-500 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Ik help je graag verder. Stuur een bericht of bel direct!
          </p>
        </div>
      </section>

      {/* Contact Methodes */}
      <section className="py-14 sm:py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl w-full overflow-x-hidden px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-14 sm:mb-16">
            {/* Telefoon Card */}
            <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                  <Phone className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Bel ons</h3>
                <a
                  href="tel:+32484522662"
                  className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors block mb-4"
                >
                  +32 484 52 26 62
                </a>
                <Button
                  onClick={() => openWhatsApp('+32484522662', 'Hallo, ik heb een vraag over jullie IT-diensten.')}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                  <Mail className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Email ons</h3>
                <a
                  href="mailto:info@koubyte.be"
                  className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors block mb-4"
                >
                  info@koubyte.be
                </a>
                <p className="text-slate-600 text-sm">
                  We reageren binnen 24 uur op werkdagen
                </p>
              </CardContent>
            </Card>

            {/* Openingstijden Card */}
            <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                  <Clock className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Openingstijden</h3>
                <div className="space-y-2 text-slate-700">
                  <div className="flex justify-between">
                    <span className="font-semibold">Ma - Vr:</span>
                    <span>09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Weekend:</span>
                    <span>Op afspraak</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto w-full overflow-x-hidden px-3 sm:px-4">
            <Card className="border-2 shadow-2xl">
              <CardContent className="p-6 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3">Stuur een bericht</h2>
                  <p className="text-slate-600 text-sm sm:text-base">Vul het formulier in en ik neem zo snel mogelijk contact met je op</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold text-slate-700">
                      Naam *
                    </Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => validateField('name', formData.name)}
                        className={`pl-10 h-12 text-base ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email" className="text-base font-semibold text-slate-700">
                      Email *
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => validateField('email', formData.email)}
                        className={`pl-10 h-12 text-base ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Field (Optional) */}
                  <div>
                    <Label htmlFor="phone" className="text-base font-semibold text-slate-700">
                      Telefoonnummer <span className="text-slate-500 font-normal">(optioneel)</span>
                    </Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="pl-10 h-12 text-base"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <Label htmlFor="subject" className="text-base font-semibold text-slate-700">
                      Onderwerp *
                    </Label>
                    <div className="relative mt-2">
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        onBlur={() => validateField('subject', formData.subject)}
                        className={`pl-10 h-12 text-base ${errors.subject ? 'border-red-500 focus:ring-red-500' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.subject && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <Label htmlFor="message" className="text-base font-semibold text-slate-700">
                      Bericht *
                    </Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      onBlur={() => validateField('message', formData.message)}
                      className={`mt-2 text-base resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                      disabled={loading}
                    />
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* General Error */}
                  {errors.general && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {errors.general}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Bericht versturen...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" />
                        Bericht versturen
                      </span>
                    )}
                  </Button>

                  <p className="text-center text-sm text-slate-500">
                    * Verplichte velden
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
