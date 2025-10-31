'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Lock, Loader2, CheckCircle, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react'

export const dynamic = 'force-dynamic'
export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (!token) {
      setTokenValid(false)
      setError('Geen reset token gevonden. Vraag een nieuwe reset link aan.')
    }
  }, [token])

  const validatePassword = (pwd: string) => {
    if (!pwd) {
      setPasswordError('Wachtwoord is verplicht')
      return false
    }
    if (pwd.length < 8) {
      setPasswordError('Wachtwoord moet minimaal 8 tekens lang zijn')
      return false
    }
    if (!/[A-Z]/.test(pwd)) {
      setPasswordError('Wachtwoord moet minimaal één hoofdletter bevatten')
      return false
    }
    if (!/[a-z]/.test(pwd)) {
      setPasswordError('Wachtwoord moet minimaal één kleine letter bevatten')
      return false
    }
    if (!/[0-9]/.test(pwd)) {
      setPasswordError('Wachtwoord moet minimaal één cijfer bevatten')
      return false
    }
    setPasswordError('')
    return true
  }

  const validateConfirmPassword = (confirmPwd: string) => {
    if (!confirmPwd) {
      setConfirmPasswordError('Bevestig wachtwoord is verplicht')
      return false
    }
    if (confirmPwd !== password) {
      setConfirmPasswordError('Wachtwoorden komen niet overeen')
      return false
    }
    setConfirmPasswordError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const isPasswordValid = validatePassword(password)
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword)

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return
    }

    if (!token) {
      setError('Geen reset token gevonden')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Redirect naar login na 3 seconden
        setTimeout(() => {
          router.push('/auth/login?message=password-reset-success')
        }, 3000)
      } else {
        setError(data.error || 'Er ging iets mis. Probeer het opnieuw.')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Wachtwoord gereset!</h2>
              <p className="text-slate-600 mb-6">
                Je wachtwoord is succesvol gewijzigd. Je wordt nu doorgestuurd naar de login pagina.
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Naar login pagina
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-2xl border-2 border-red-200">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Ongeldige link</h2>
              <p className="text-slate-600 mb-6">
                Er is geen reset token gevonden. Vraag een nieuwe reset link aan.
              </p>
              <Link href="/auth/forgot-password">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Nieuwe reset link aanvragen
                </Button>
              </Link>
              <Link href="/auth/login" className="block mt-3 text-sm text-blue-600 hover:text-blue-700">
                Terug naar login
              </Link>
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
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900">
              Nieuw wachtwoord instellen
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Kies een sterk wachtwoord voor je account
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
                <Label htmlFor="password" className="text-sm sm:text-base">Nieuw wachtwoord</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (passwordError) validatePassword(e.target.value)
                      if (confirmPassword && confirmPasswordError) {
                        validateConfirmPassword(confirmPassword)
                      }
                    }}
                    onBlur={() => validatePassword(password)}
                    placeholder="Minimaal 8 tekens met hoofdletter, kleine letter en cijfer"
                    className={`pr-10 text-sm sm:text-base ${passwordError ? 'border-red-500 border-2' : ''}`}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1">{passwordError}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Minimaal 8 tekens, met hoofdletter, kleine letter en cijfer
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm sm:text-base">
                  Bevestig wachtwoord
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (confirmPasswordError) validateConfirmPassword(e.target.value)
                    }}
                    onBlur={() => validateConfirmPassword(confirmPassword)}
                    placeholder="Herhaal je wachtwoord"
                    className={`pr-10 text-sm sm:text-base ${confirmPasswordError ? 'border-red-500 border-2' : ''}`}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1">{confirmPasswordError}</p>
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
                    Wachtwoord resetten...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Wachtwoord resetten
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

