'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Loader2, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors }

    switch (field) {
      case 'name':
        if (!value) {
          newErrors.name = 'Naam is verplicht'
        } else if (value.length < 2) {
          newErrors.name = 'Naam moet minimaal 2 tekens bevatten'
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

      case 'password':
        if (!value) {
          newErrors.password = 'Wachtwoord is verplicht'
        } else if (value.length < 8) {
          newErrors.password = 'Wachtwoord moet minimaal 8 tekens bevatten'
        } else if (!/[A-Z]/.test(value)) {
          newErrors.password = 'Wachtwoord moet minimaal 1 hoofdletter bevatten'
        } else if (!/[a-z]/.test(value)) {
          newErrors.password = 'Wachtwoord moet minimaal 1 kleine letter bevatten'
        } else if (!/[0-9]/.test(value)) {
          newErrors.password = 'Wachtwoord moet minimaal 1 cijfer bevatten'
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          newErrors.password = 'Wachtwoord moet minimaal 1 speciaal teken bevatten (!@#$%^&*...)'
        } else {
          delete newErrors.password
        }
        // Also validate confirm password if it has a value
        if (formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Wachtwoorden komen niet overeen'
          } else {
            delete newErrors.confirmPassword
          }
        }
        break

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Bevestig je wachtwoord'
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Wachtwoorden komen niet overeen'
        } else {
          delete newErrors.confirmPassword
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

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field as keyof typeof formData])
    })

    // Check for errors
    if (Object.keys(errors).length > 0) {
      return
    }

    // Check checkboxes
    if (!acceptedPrivacy || !acceptedTerms) {
      setErrors({
        ...errors,
        terms: 'Je moet akkoord gaan met de voorwaarden',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || 'Registratie mislukt' })
        setLoading(false)
        return
      }

      setSuccess(true)
      // Redirect naar verificatie pagina met email parameter
      setTimeout(() => {
        router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`)
      }, 2000)
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ general: 'Er ging iets mis. Probeer het opnieuw.' })
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-green-500 rounded-2xl p-12 text-center shadow-2xl animate-fadeInUp">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Account aangemaakt!</h2>
            <p className="text-lg text-slate-600 mb-4">
              Je account is succesvol aangemaakt. We hebben een verificatiecode naar je email gestuurd. Je wordt doorgestuurd naar de verificatie pagina...
            </p>
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8 animate-fadeInDown">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Maak een account</h1>
          <p className="text-slate-600 text-sm sm:text-base">Word lid van Koubyte</p>
        </div>

        <Card className="shadow-2xl border-2 animate-fadeInUp">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Registreren</CardTitle>
            <CardDescription className="text-sm sm:text-base">Vul je gegevens in om te beginnen</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <Label htmlFor="name" className="text-base font-semibold text-slate-700">
                  Naam
                </Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => validateField('name', formData.name)}
                    className={`pl-10 h-12 text-base ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
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
                  Email adres
                </Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => validateField('email', formData.email)}
                    className={`pl-10 h-12 text-base ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
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

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="text-base font-semibold text-slate-700">
                  Wachtwoord
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => validateField('password', formData.password)}
                    className={`pl-10 pr-12 h-12 text-base ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
                <div className="mt-2 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold">Wachtwoord moet bevatten:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-1">
                    <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>Minimaal 8 tekens</li>
                    <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>Minimaal 1 hoofdletter</li>
                    <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>Minimaal 1 kleine letter</li>
                    <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>Minimaal 1 cijfer</li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : ''}>Minimaal 1 speciaal teken (!@#$%^&*...)</li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <Label htmlFor="confirmPassword" className="text-base font-semibold text-slate-700">
                  Bevestig wachtwoord
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => validateField('confirmPassword', formData.confirmPassword)}
                    className={`pl-10 pr-12 h-12 text-base ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Privacy & Terms Checkboxes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="privacy"
                    checked={acceptedPrivacy}
                    onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                    className="mt-1"
                  />
                  <label htmlFor="privacy" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
                    Ik ga akkoord met het{' '}
                    <Link href="/privacy" target="_blank" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                      privacybeleid
                    </Link>
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
                    Ik ga akkoord met de{' '}
                    <Link href="/terms" target="_blank" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                      algemene voorwaarden
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.terms}
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
                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Account aanmaken...
                  </span>
                ) : (
                  'Account aanmaken'
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Al een account?{' '}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Log hier in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors inline-flex items-center gap-2"
          >
            ← Terug naar home
          </Link>
        </div>
      </div>
    </div>
  )
}
