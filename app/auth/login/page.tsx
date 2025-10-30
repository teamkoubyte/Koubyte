'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Check for password reset success message
  useEffect(() => {
    const message = searchParams.get('message')
    if (message === 'password-reset-success') {
      setSuccessMessage('Je wachtwoord is succesvol gereset. Je kunt nu inloggen met je nieuwe wachtwoord.')
      // Clear message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }, [searchParams])

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

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Wachtwoord is verplicht')
      return false
    }
    if (password.length < 6) {
      setPasswordError('Wachtwoord moet minimaal 6 tekens bevatten')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate fields
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      })

      if (result?.error) {
        // Check of het een email verificatie error is
        if (result.error.includes('EMAIL_NOT_VERIFIED') || result.error.includes('CredentialsSignin')) {
          // Probeer te checken of de gebruiker bestaat maar niet geverifieerd is
          const checkResponse = await fetch('/api/auth/check-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          })
          
          if (checkResponse.ok) {
            const data = await checkResponse.json()
            if (!data.verified) {
              setError('Je email is nog niet geverifieerd. Check je inbox voor de verificatiecode.')
              setLoading(false)
              // Redirect naar verificatie pagina na 2 seconden
              setTimeout(() => {
                window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`
              }, 2000)
              return
            }
          }
        }
        
        setError('Ongeldige inloggegevens. Controleer je email en wachtwoord.')
        setLoading(false)
        return
      }

      if (result?.ok) {
        // Haal sessie op om rol te checken
        const response = await fetch('/api/auth/session')
        const session = await response.json()
        
        // Redirect op basis van rol: admin naar /admin, anders naar /dashboard
        if (session?.user?.role === 'admin') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/dashboard'
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Er ging iets mis. Probeer het opnieuw.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8 animate-fadeInDown">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Welkom terug!</h1>
          <p className="text-slate-600 text-sm sm:text-base">Log in op je Koubyte account</p>
        </div>

        <Card className="shadow-2xl border-2 animate-fadeInUp">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Inloggen</CardTitle>
            <CardDescription className="text-sm sm:text-base">Vul je gegevens in om verder te gaan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) validateEmail(e.target.value)
                    }}
                    onBlur={() => validateEmail(email)}
                    className={`pl-10 h-12 text-base ${
                      emailError ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    disabled={loading}
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {emailError}
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
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (passwordError) validatePassword(e.target.value)
                    }}
                    onBlur={() => validatePassword(password)}
                    className={`pl-10 pr-12 h-12 text-base ${
                      passwordError ? 'border-red-500 focus:ring-red-500' : ''
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
                {passwordError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {passwordError}
                  </p>
                )}
              </div>

              {/* General Error */}
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
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
                    Inloggen...
                  </span>
                ) : (
                  'Inloggen'
                )}
              </Button>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-4 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Wachtwoord vergeten?
              </Link>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Nog geen account?{' '}
                <Link
                  href="/auth/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Registreer hier
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
