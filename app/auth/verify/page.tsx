'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Mail, AlertCircle, Loader2, CheckCircle, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'
export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''
  
  const [email, setEmail] = useState(emailFromUrl)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Email is verplicht')
      return
    }

    if (!code) {
      setError('Verificatiecode is verplicht')
      return
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setError('Verificatiecode moet 6 cijfers zijn')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Verificatie mislukt')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login?verified=true')
      }, 2000)
    } catch (error) {
      console.error('Verification error:', error)
      setError('Er ging iets mis. Probeer het opnieuw.')
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      setError('Email is verplicht om een nieuwe code te versturen')
      return
    }

    setResending(true)
    setError('')
    setResendSuccess(false)

    try {
      const response = await fetch('/api/auth/verify/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Kon geen nieuwe code versturen')
        setResending(false)
        return
      }

      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 5000)
    } catch (error) {
      console.error('Resend error:', error)
      setError('Er ging iets mis bij het versturen van een nieuwe code')
    } finally {
      setResending(false)
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
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Email geverifieerd!</h2>
            <p className="text-lg text-slate-600 mb-4">
              Je account is succesvol geverifieerd. Je wordt doorgestuurd naar de inlogpagina...
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
        <div className="text-center mb-8 animate-fadeInDown">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Verifieer je email</h1>
          <p className="text-slate-600">Voer de 6-cijferige code in die naar je email is gestuurd</p>
        </div>

        <Card className="shadow-2xl border-2 animate-fadeInUp">
          <CardHeader>
            <CardTitle className="text-2xl">Email verificatie</CardTitle>
            <CardDescription>
              We hebben een verificatiecode gestuurd naar {email && <span className="font-semibold text-slate-700">{email}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-5">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 text-base"
                    disabled={loading || !!emailFromUrl}
                    placeholder="jouw@email.nl"
                  />
                </div>
              </div>

              {/* Verification Code Field */}
              <div>
                <Label htmlFor="code" className="text-base font-semibold text-slate-700">
                  Verificatiecode
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setCode(value)
                    }}
                    className="h-12 text-center text-2xl font-bold tracking-widest"
                    disabled={loading}
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="off"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500 text-center">
                  De code is 15 minuten geldig
                </p>
              </div>

              {/* Resend Success Message */}
              {resendSuccess && (
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Een nieuwe verificatiecode is verstuurd naar je email!
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </p>
                </div>
              )}

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifiëren...
                  </span>
                ) : (
                  'Verifieer email'
                )}
              </Button>
            </form>

            {/* Resend Code */}
            <div className="mt-6 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Code niet ontvangen?</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={resending}
                className="w-full"
              >
                {resending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Versturen...
                  </span>
                ) : (
                  'Stuur nieuwe code'
                )}
              </Button>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Al geverifieerd?{' '}
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

