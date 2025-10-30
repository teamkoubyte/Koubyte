'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Mail, Loader2, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email is verplicht')
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Voer een geldig emailadres in')
      return false
    }
    setEmailError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateEmail(email)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Er ging iets mis. Probeer het opnieuw.')
      }
    } catch (error) {
      console.error('Error requesting password reset:', error)
      setError('Er ging iets mis. Probeer het later opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-2xl border-2 border-green-200">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Email verzonden!</h2>
              <p className="text-slate-600 mb-6">
                Als deze email bestaat in ons systeem, heb je een wachtwoord reset link ontvangen. 
                Check je inbox en spam folder.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                De reset link is <strong>1 uur geldig</strong> en kan slechts één keer gebruikt worden.
              </p>
              <div className="space-y-3">
                <Link href="/auth/login">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Terug naar login
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Nieuwe reset aanvragen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900">
              Wachtwoord vergeten?
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Voer je emailadres in en we sturen je een link om je wachtwoord te resetten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-sm sm:text-base">Emailadres</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) validateEmail(e.target.value)
                  }}
                  onBlur={() => validateEmail(email)}
                  placeholder="je@email.be"
                  className={`mt-2 text-sm sm:text-base ${emailError ? 'border-red-500 border-2' : ''}`}
                  required
                  disabled={loading}
                />
                {emailError && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1">{emailError}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-3 sm:py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Versturen...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Reset link verzenden
                  </>
                )}
              </Button>

              <div className="text-center pt-4 border-t border-slate-200">
                <Link
                  href="/auth/login"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Terug naar login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

