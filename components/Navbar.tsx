'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, LogIn, ShoppingCart, User, LayoutDashboard, Settings, Heart, Package, Calendar, Star, HelpCircle, LogOut, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'
import ShoppingCartWidget from './ShoppingCart'
import NotificationCenter from './NotificationCenter'

interface NavbarProps {
  session: any
}

export default function Navbar({ session }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const desktopUserMenuRef = useRef<HTMLDivElement>(null)
  const mobileUserMenuRef = useRef<HTMLDivElement>(null)
  
  // Admin homepage is /admin, anders is het /
  const homeUrl = session?.user?.role === 'admin' ? '/admin' : '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch cart item count voor mobiele shopping cart icon
  useEffect(() => {
    if (session?.user?.id && session.user.role !== 'admin') {
      fetch('/api/cart')
        .then(res => res.json())
        .then(data => {
          if (data.cartItems && Array.isArray(data.cartItems)) {
            const count = data.cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
            setCartItemCount(count)
          }
        })
        .catch(() => setCartItemCount(0))
      
      // Listen for cart updates
      const handleCartUpdate = () => {
        fetch('/api/cart')
          .then(res => res.json())
          .then(data => {
            if (data.cartItems && Array.isArray(data.cartItems)) {
              const count = data.cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
              setCartItemCount(count)
            }
          })
          .catch(() => setCartItemCount(0))
      }
      
      window.addEventListener('cart-updated', handleCartUpdate)
      return () => window.removeEventListener('cart-updated', handleCartUpdate)
    }
  }, [session])

  // Close user menu when clicking outside (for both desktop and mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!userMenuOpen) return
      
      const target = event.target as Node
      const desktopMenu = desktopUserMenuRef.current
      const mobileMenu = mobileUserMenuRef.current
      
      // Check if click is outside desktop menu (if it exists)
      const clickedOutsideDesktop = !desktopMenu || !desktopMenu.contains(target)
      
      // Check if click is outside mobile menu (if it exists)
      const clickedOutsideMobile = !mobileMenu || !mobileMenu.contains(target)
      
      // Close if click is outside the relevant menu
      // On desktop: check desktop menu, on mobile: check mobile menu
      // But if both exist (unlikely), close only if outside both
      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      // Use capture phase to catch clicks early
      document.addEventListener('mousedown', handleClickOutside, true)
      document.addEventListener('touchstart', handleClickOutside as any, true)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true)
        document.removeEventListener('touchstart', handleClickOutside as any, true)
      }
    }
  }, [userMenuOpen])

  // Close user menu when mobile menu opens
  useEffect(() => {
    if (mobileMenuOpen && userMenuOpen) {
      setUserMenuOpen(false)
    }
  }, [mobileMenuOpen])

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 w-full overflow-x-hidden ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200' 
          : 'bg-white border-b border-slate-100'
      }`}
      id="main-navbar"
    >
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 w-full overflow-x-hidden" data-cart="container">
        <div className="flex justify-between items-center h-20 min-w-0">
          {/* Logo - Simpel en Professioneel */}
          <Link href={homeUrl} className="flex items-center group">
            <span className="text-3xl font-bold logo-sharp">
              <span className="text-blue-600">Kou</span>
              <span className="text-slate-800">byte</span>
            </span>
          </Link>

          {/* Desktop Menu - Verberg eerder voor betere responsive design */}
          <div className="hidden xl:flex items-center space-x-1 min-w-0 flex-1 justify-end">
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
            <Link href="/blog" className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-slate-50 transition-all duration-200">
              Blog
            </Link>
            <Link href="/quote" className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-slate-50 transition-all duration-200">
              Offerte
            </Link>
            <Link href="/contact" className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-slate-50 transition-all duration-200">
              Contact
            </Link>

            <div className="ml-4 flex items-center gap-3">
              {/* Shopping Cart Widget - alleen voor ingelogde gebruikers en HIDDEN op mobiel */}
              {session && session.user.role !== 'admin' && (
                <div className="hidden xl:block">
                  <ShoppingCartWidget />
                </div>
              )}
              
              {/* Notification Center - alleen voor ingelogde gebruikers (geen admin) */}
              {session && session.user.role !== 'admin' && (
                <NotificationCenter />
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
                    // Normale gebruikers zien gebruikersmenu dropdown
                    <div className="relative" ref={desktopUserMenuRef}>
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border border-slate-300 hover:bg-slate-50 transition-colors"
                        aria-label="Gebruikersmenu"
                      >
                        <User className="h-5 w-5 text-slate-700" />
                        <span className="hidden lg:block text-slate-700">{session.user.name || 'Account'}</span>
                        <ChevronDown className={`h-4 w-4 text-slate-600 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Desktop User Dropdown Menu */}
                      {userMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-[100] animate-fadeInDown">
                          {/* Gebruikersinfo */}
                          <div className="px-4 py-3 border-b border-slate-200">
                            <p className="font-semibold text-slate-900 text-sm">{session.user.name || 'Gebruiker'}</p>
                            <p className="text-xs text-slate-600">{session.user.email}</p>
                          </div>
                          
                          {/* Menu Items */}
                          <div className="py-1">
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <LayoutDashboard className="h-5 w-5 text-slate-600" />
                              <span className="text-sm font-medium">Mijn Koubyte</span>
                            </Link>
                            
                            <Link
                              href="/dashboard/privacy"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Settings className="h-5 w-5 text-slate-600" />
                              <span className="text-sm font-medium">Gegevens en voorkeuren</span>
                            </Link>
                            
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Heart className="h-5 w-5 text-slate-600" />
                              <span className="text-sm font-medium">Verlanglijstje</span>
                            </Link>
                            
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Calendar className="h-5 w-5 text-slate-600" />
                              <span className="text-sm font-medium">Mijn afspraken</span>
                            </Link>
                            
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Package className="h-5 w-5 text-slate-600" />
                              <span className="text-sm font-medium">Mijn bestellingen</span>
                            </Link>
                            
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Star className="h-5 w-5 text-slate-600" />
                              <span className="text-sm font-medium">Mijn reviews</span>
                            </Link>
                            
                            <div className="border-t border-slate-200 my-1" />
                            
                            <Link
                              href="/faq"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <HelpCircle className="h-5 w-5 text-slate-600" />
                              <span className="text-sm font-medium">Help & Support</span>
                            </Link>
                            
                            <button
                              onClick={() => {
                                setUserMenuOpen(false)
                                signOut({ callbackUrl: '/' })
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="h-5 w-5" />
                              <span className="text-sm font-medium">Uitloggen</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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

          {/* Mobile Icons + Menu Knop - Iconen naast hamburger menu */}
          <div className="xl:hidden flex items-center gap-2">
            {/* Shopping Cart Icon - Alleen voor ingelogde gebruikers (geen admin) */}
            {session && session.user.role !== 'admin' && (
              <Link href="/checkout" className="relative p-3 rounded-xl hover:bg-slate-100 transition-colors touch-manipulation active:scale-[0.98]">
                <ShoppingCart className="h-6 w-6 text-slate-700" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Login Icon - Alleen als niet ingelogd */}
            {!session && (
              <Link href="/auth/login" className="p-3 rounded-xl hover:bg-slate-100 transition-colors touch-manipulation active:scale-[0.98]">
                <LogIn className="h-6 w-6 text-slate-700" />
              </Link>
            )}
            
            {/* User Menu Dropdown - Alleen als ingelogd (geen admin) */}
            {session && session.user.role !== 'admin' && (
              <div className="relative" ref={mobileUserMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-3 rounded-xl hover:bg-slate-100 transition-colors touch-manipulation active:scale-[0.98] relative"
                  aria-label="Gebruikersmenu"
                >
                  <User className="h-6 w-6 text-slate-700" />
                </button>
                
                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-[100] animate-fadeInDown">
                    {/* Gebruikersinfo */}
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p className="font-semibold text-slate-900 text-sm">{session.user.name || 'Gebruiker'}</p>
                      <p className="text-xs text-slate-600">{session.user.email}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium">Mijn Koubyte</span>
                      </Link>
                      
                      <Link
                        href="/dashboard/privacy"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Settings className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium">Gegevens en voorkeuren</span>
                      </Link>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Heart className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium">Verlanglijstje</span>
                      </Link>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Calendar className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium">Mijn afspraken</span>
                      </Link>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Package className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium">Mijn bestellingen</span>
                      </Link>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Star className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium">Mijn reviews</span>
                      </Link>
                      
                      <div className="border-t border-slate-200 my-1" />
                      
                      <Link
                        href="/faq"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <HelpCircle className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium">Help & Support</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm font-medium">Uitloggen</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Hamburger Menu Knop */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-xl hover:bg-slate-100 transition-colors touch-manipulation active:scale-[0.98]"
              aria-label={mobileMenuOpen ? 'Sluit menu' : 'Open menu'}
            >
              {mobileMenuOpen ? 
                <X className="h-6 w-6 text-slate-700" /> : 
                <Menu className="h-6 w-6 text-slate-700" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu - Toon eerder (xl in plaats van lg) */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 space-y-2 animate-fadeInDown border-t border-slate-100 w-full overflow-x-hidden">
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
              href="/blog" 
              className="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-slate-50 font-medium rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/quote" 
              className="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-slate-50 font-medium rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Offerte
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
