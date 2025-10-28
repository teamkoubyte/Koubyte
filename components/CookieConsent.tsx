'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Link from 'next/link'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show banner after 1 second
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fadeInUp">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                🍪 Deze website gebruikt cookies
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We gebruiken alleen <strong>essentiële cookies</strong> die noodzakelijk zijn voor de werking van de website 
                (zoals inloggen en navigatie). We plaatsen <strong>geen</strong> tracking of marketing cookies. 
                Meer informatie vindt u in ons <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold underline">privacybeleid</Link>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                onClick={acceptCookies}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3"
              >
                Accepteren
              </Button>
              <Button
                onClick={declineCookies}
                variant="outline"
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg px-6 py-3"
              >
                Weigeren
              </Button>
            </div>
            <button
              onClick={declineCookies}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Sluiten"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

