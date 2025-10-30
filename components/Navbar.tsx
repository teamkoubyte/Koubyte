'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import ShoppingCartWidget from './ShoppingCart'

interface NavbarProps {
  session: any
}

export default function Navbar({ session }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Admin homepage is /admin, anders is het /
  const homeUrl = session?.user?.role === 'admin' ? '/admin' : '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200' 
          : 'bg-white border-b border-slate-100'
      }`}
      id="main-navbar"
    >
      <div className="container mx-auto max-w-7xl px-4" data-cart="container">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Simpel en Professioneel */}
          <Link href={homeUrl} className="flex items-center group">
            <span className="text-3xl font-bold logo-sharp">
              <span className="text-blue-600">Kou</span>
              <span className="text-slate-800">byte</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href={homeUrl} className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-slate-50 transition-all duration-200">
              Home
            </Link>
            <Link href="/about" className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-slate-50 transition-all duration-200">
              Over mij
            </Link>
            <Link href="/diensten" className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-slate-50 transition-all duration-200">
              Diensten
            </Link>
            <Link href="/pricing" className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-slate-50 transition-all duration-200">
              Prijzen
            </Link>
            <Link href="/faq" className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-slate-50 transition-all duration-200">
              Veelgestelde vragen
            </Link>
            <Link href="/contact" className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-slate-50 transition-all duration-200">
              Contact
            </Link>

            <div className="ml-4 flex items-center gap-3">
              {/* Shopping Cart Widget - alleen voor ingelogde gebruikers en HIDDEN op mobiel */}
              {session && (
                <div className="hidden xl:block">
                  <ShoppingCartWidget />
                </div>
              )}
              
              {session ? (
                <>
                  {session.user.role === 'admin' ? (
                    // Admin ziet alleen link naar admin panel
                    <Link href="/admin">
                      <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold">
                        Admin Panel
                      </Button>
                    </Link>
                  ) : (
                    // Normale gebruikers zien dashboard
                    <Link href="/dashboard">
                      <Button variant="outline" className="rounded-lg font-semibold border-slate-300">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" onClick={() => signOut()} className="rounded-lg font-semibold">
                    Uitloggen
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="rounded-lg font-semibold text-slate-700">
                      Inloggen
                    </Button>
                  </Link>
                  <Link href="/book">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                      Afspraak maken
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Knop */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? 
              <X className="h-6 w-6 text-slate-700" /> : 
              <Menu className="h-6 w-6 text-slate-700" />
            }
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 animate-fadeInDown border-t border-slate-100">
            <Link 
              href={homeUrl} 
              className="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-slate-50 font-medium rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-slate-50 font-medium rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Over mij
            </Link>
            <Link 
              href="/diensten" 
              className="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-slate-50 font-medium rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Diensten
            </Link>
            <Link 
              href="/pricing" 
              className="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-slate-50 font-medium rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Prijzen
            </Link>
            <Link 
              href="/faq" 
              className="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-slate-50 font-medium rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Veelgestelde vragen
            </Link>
            <Link 
              href="/contact" 
              className="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-slate-50 font-medium rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="pt-4 border-t border-slate-200 space-y-2">
              {session ? (
                <>
                  {session.user.role === 'admin' ? (
                    // Admin ziet alleen link naar admin panel
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold">
                        Admin Panel
                      </Button>
                    </Link>
                  ) : (
                    // Normale gebruikers zien dashboard EN checkout (mobiel alternatief voor cart)
                    <>
                      <Link href="/checkout" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                          🛒 Winkelwagen
                        </Button>
                      </Link>
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-lg font-semibold border-slate-300">
                          Dashboard
                        </Button>
                      </Link>
                    </>
                  )}
                  <Button 
                    variant="ghost" 
                    className="w-full rounded-lg font-semibold" 
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut()
                    }}
                  >
                    Uitloggen
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full rounded-lg font-semibold text-slate-700">
                      Inloggen
                    </Button>
                  </Link>
                  <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md">
                      Afspraak maken
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
