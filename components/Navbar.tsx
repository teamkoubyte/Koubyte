'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, LogIn, ShoppingCart, User, LayoutDashboard, Settings, Heart, Package, Calendar, Star, HelpCircle, LogOut, ChevronDown, Wrench, DollarSign, FileText, Info, Users, BookOpen, MessageSquare } from 'lucide-react'
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
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false)
  const [infoMenuOpen, setInfoMenuOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const desktopUserMenuRef = useRef<HTMLDivElement>(null)
  const mobileUserMenuRef = useRef<HTMLDivElement>(null)
  const desktopUserButtonRef = useRef<HTMLButtonElement>(null)
  const mobileUserButtonRef = useRef<HTMLButtonElement>(null)
  const servicesMenuContainerRef = useRef<HTMLDivElement>(null)
  const servicesMenuDropdownRef = useRef<HTMLDivElement>(null)
  const servicesButtonRef = useRef<HTMLButtonElement>(null)
  const infoMenuContainerRef = useRef<HTMLDivElement>(null)
  const infoMenuDropdownRef = useRef<HTMLDivElement>(null)
  const infoButtonRef = useRef<HTMLButtonElement>(null)
  const accountMenuContainerRef = useRef<HTMLDivElement>(null)
  const accountMenuDropdownRef = useRef<HTMLDivElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)
  
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

  // Close all dropdowns when clicking outside - WORKING VERSION
  useEffect(() => {
    if (!userMenuOpen && !servicesMenuOpen && !infoMenuOpen && !accountMenuOpen) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement
      if (!target) return
      
      // Check all refs to see if click is inside any menu or button
      const allMenuRefs = [
        servicesMenuContainerRef.current,
        servicesMenuDropdownRef.current,
        infoMenuContainerRef.current,
        infoMenuDropdownRef.current,
        accountMenuContainerRef.current,
        accountMenuDropdownRef.current,
        desktopUserMenuRef.current,
        mobileUserMenuRef.current,
      ]
      
      const allButtonRefs = [
        servicesButtonRef.current,
        infoButtonRef.current,
        accountButtonRef.current,
        desktopUserButtonRef.current,
        mobileUserButtonRef.current,
      ]
      
      // Check if click is inside any menu container
      const clickedInMenu = allMenuRefs.some(ref => {
        if (!ref) return false
        return ref.contains(target) || ref === target
      })
      
      // Check if click is on any button
      const clickedOnButton = allButtonRefs.some(ref => {
        if (!ref) return false
        return ref.contains(target) || ref === target
      })
      
      // Check if click is on nav buttons (hamburger, cart, etc.)
      const clickedOnNavButton = target.closest('button[aria-label*="menu" i]') ||
                                 target.closest('a[href="/checkout"]') ||
                                 target.closest('[data-cart]')
      
      // Only close if click is truly outside
      if (!clickedInMenu && !clickedOnButton && !clickedOnNavButton) {
        setServicesMenuOpen(false)
        setInfoMenuOpen(false)
        setAccountMenuOpen(false)
        setUserMenuOpen(false)
      }
    }

    // Delay adding listener to allow menu to render first - USE CLICK INSTEAD OF MOUSEDOWN
    const timeoutId = setTimeout(() => {
      // Use 'click' event instead of 'mousedown' to avoid closing immediately when button is clicked
      document.addEventListener('click', handleClickOutside, true)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [userMenuOpen, servicesMenuOpen, infoMenuOpen, accountMenuOpen])

  // Close mobile menu when user menu opens, and vice versa
  useEffect(() => {
    if (userMenuOpen && mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }, [userMenuOpen])
  
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

          {/* Desktop Menu - Allemaal dropdown menu's */}
          <div className="hidden xl:flex items-center space-x-2 min-w-0 flex-1 justify-end">
            {/* Home - Directe link */}
            <Link 
              href={homeUrl} 
              className="px-4 py-2 text-slate-700 hover:text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              Home
            </Link>

            {/* Diensten Dropdown */}
            <div className="relative" ref={servicesMenuContainerRef}>
              <button
                ref={servicesButtonRef}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const newState = !servicesMenuOpen
                  setServicesMenuOpen(newState)
                  if (newState) {
                    setInfoMenuOpen(false)
                    setAccountMenuOpen(false)
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onMouseEnter={() => {
                  if (!mobileMenuOpen && window.innerWidth >= 1280) {
                    setServicesMenuOpen(true)
                    setInfoMenuOpen(false)
                    setAccountMenuOpen(false)
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-slate-700 hover:text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 group"
                aria-expanded={servicesMenuOpen}
              >
                <Wrench className="h-4 w-4" />
                <span>Diensten</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${servicesMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {servicesMenuOpen && (
                <div 
                  ref={servicesMenuDropdownRef}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden z-[9999] animate-fadeInDown backdrop-blur-sm"
                  onMouseEnter={() => {
                    setServicesMenuOpen(true)
                  }}
                  onMouseLeave={() => {
                    // Only close on mouse leave if not on mobile
                    if (window.innerWidth >= 1280) {
                      setServicesMenuOpen(false)
                    }
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <div className="py-2">
                    <Link
                      href="/diensten"
                      onClick={() => setServicesMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                    >
                      <Wrench className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm">Onze Diensten</div>
                        <div className="text-xs text-slate-500">Bekijk alle IT-diensten</div>
                      </div>
                    </Link>
                    
                    <Link
                      href="/pricing"
                      onClick={() => setServicesMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                    >
                      <DollarSign className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm">Prijzen</div>
                        <div className="text-xs text-slate-500">Transparante tarieven</div>
                      </div>
                    </Link>
                    
                    <Link
                      href="/quote"
                      onClick={() => setServicesMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                    >
                      <FileText className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm">Offerte Aanvragen</div>
                        <div className="text-xs text-slate-500">Gratis prijsopgave</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Informatie Dropdown */}
            <div className="relative" ref={infoMenuContainerRef}>
              <button
                ref={infoButtonRef}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const newState = !infoMenuOpen
                  setInfoMenuOpen(newState)
                  if (newState) {
                    setServicesMenuOpen(false)
                    setAccountMenuOpen(false)
                  }
                }}
                onMouseEnter={() => {
                  if (!mobileMenuOpen && window.innerWidth >= 1280) {
                    setInfoMenuOpen(true)
                    setServicesMenuOpen(false)
                    setAccountMenuOpen(false)
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-slate-700 hover:text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 group"
                aria-expanded={infoMenuOpen}
              >
                <Info className="h-4 w-4" />
                <span>Informatie</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${infoMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {infoMenuOpen && (
                <div 
                  ref={infoMenuDropdownRef}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden z-[9999] animate-fadeInDown backdrop-blur-sm"
                  onMouseEnter={() => setInfoMenuOpen(true)}
                  onMouseLeave={() => {
                    // Only close on mouse leave if not on mobile
                    if (window.innerWidth >= 1280) {
                      setInfoMenuOpen(false)
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-2">
                    <Link
                      href="/about"
                      onClick={() => setInfoMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                    >
                      <Users className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm">Over Mij</div>
                        <div className="text-xs text-slate-500">Leer meer over Koubyte</div>
                      </div>
                    </Link>
                    
                    <Link
                      href="/faq"
                      onClick={() => setInfoMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                    >
                      <HelpCircle className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm">Veelgestelde Vragen</div>
                        <div className="text-xs text-slate-500">Vind snel antwoorden</div>
                      </div>
                    </Link>
                    
                    <Link
                      href="/blog"
                      onClick={() => setInfoMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                    >
                      <BookOpen className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm">Blog</div>
                        <div className="text-xs text-slate-500">IT-tips & handleidingen</div>
                      </div>
                    </Link>
                    
                    <Link
                      href="/contact"
                      onClick={() => setInfoMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                    >
                      <MessageSquare className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm">Contact</div>
                        <div className="text-xs text-slate-500">Neem contact op</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Account Actions - Shopping Cart, Notifications, Account Menu */}
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
                      <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                        Admin Panel
                      </Button>
                    </Link>
                  ) : (
                    // Normale gebruikers zien gebruikersmenu dropdown
                    <div className="relative" ref={desktopUserMenuRef}>
                      <button
                        ref={desktopUserButtonRef}
                        onMouseDown={(e) => {
                          // Prevent menu from closing immediately when button is clicked
                          e.preventDefault()
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const newState = !userMenuOpen
                          setUserMenuOpen(newState)
                          if (newState) {
                            setServicesMenuOpen(false)
                            setInfoMenuOpen(false)
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border border-slate-300 hover:bg-slate-50 transition-colors"
                        aria-label="Gebruikersmenu"
                        aria-expanded={userMenuOpen}
                      >
                        <User className="h-5 w-5 text-slate-700" />
                        <span className="hidden lg:block text-slate-700">{session.user.name || 'Account'}</span>
                        <ChevronDown className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Desktop User Dropdown Menu */}
                      {userMenuOpen && (
                        <div 
                          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden z-[9999] animate-fadeInDown backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          {/* Gebruikersinfo Header */}
                          <div className="px-5 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-b border-blue-400/20">
                            <p className="font-bold text-white text-base mb-1 leading-tight">{session.user.name || 'Gebruiker'}</p>
                            <p className="text-xs text-blue-100 truncate leading-tight">{session.user.email}</p>
                          </div>
                          
                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                            >
                              <LayoutDashboard className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold text-sm">Mijn Koubyte</div>
                                <div className="text-xs text-slate-500">Dashboard overzicht</div>
                              </div>
                            </Link>
                            
                            <Link
                              href="/dashboard/privacy"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                            >
                              <Settings className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold text-sm">Gegevens & Voorkeuren</div>
                                <div className="text-xs text-slate-500">Privacy instellingen</div>
                              </div>
                            </Link>
                            
                            <div className="border-t border-slate-200/60 my-1.5" />
                            
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                            >
                              <Calendar className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold text-sm">Mijn Afspraken</div>
                                <div className="text-xs text-slate-500">Bekijk & beheer</div>
                              </div>
                            </Link>
                            
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                            >
                              <Package className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold text-sm">Mijn Bestellingen</div>
                                <div className="text-xs text-slate-500">Bestelgeschiedenis</div>
                              </div>
                            </Link>
                            
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                            >
                              <Heart className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold text-sm">Verlanglijstje</div>
                                <div className="text-xs text-slate-500">Opgeslagen items</div>
                              </div>
                            </Link>
                            
                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                            >
                              <Star className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold text-sm">Mijn Reviews</div>
                                <div className="text-xs text-slate-500">Bekijk je reviews</div>
                              </div>
                            </Link>
                            
                            <div className="border-t border-slate-200/60 my-1.5" />
                            
                            <Link
                              href="/faq"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 group"
                            >
                              <HelpCircle className="h-5 w-5 text-slate-400 group-hover:text-slate-700 transition-colors flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-semibold text-sm">Help & Support</div>
                                <div className="text-xs text-slate-500">Vragen of hulp nodig?</div>
                              </div>
                            </Link>
                            
                            <div className="border-t border-slate-200/60 my-1.5" />
                            
                            <button
                              onClick={() => {
                                setUserMenuOpen(false)
                                signOut({ callbackUrl: '/' })
                              }}
                              className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                            >
                              <LogOut className="h-5 w-5 group-hover:text-red-700 transition-colors flex-shrink-0" />
                              <div className="flex-1 text-left">
                                <div className="font-semibold text-sm">Uitloggen</div>
                                <div className="text-xs text-red-500/80">Afmelden van je account</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Account Dropdown voor niet-ingelogde gebruikers */}
                  <div className="relative" ref={accountMenuContainerRef}>
                    <button
                      ref={accountButtonRef}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const newState = !accountMenuOpen
                        setAccountMenuOpen(newState)
                        if (newState) {
                          setServicesMenuOpen(false)
                          setInfoMenuOpen(false)
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border border-slate-300 hover:bg-slate-50 transition-colors"
                      aria-expanded={accountMenuOpen}
                    >
                      <User className="h-5 w-5 text-slate-700" />
                      <span>Account</span>
                      <ChevronDown className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${accountMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {accountMenuOpen && (
                      <div 
                        ref={accountMenuDropdownRef}
                        className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200/80 overflow-hidden z-[9999] animate-fadeInDown backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        <div className="py-2">
                          <Link
                            href="/auth/login"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                          >
                            <LogIn className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-sm">Inloggen</div>
                              <div className="text-xs text-slate-500">Log in op je account</div>
                            </div>
                          </Link>
                          
                          <Link
                            href="/auth/register"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                          >
                            <User className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-sm">Registreren</div>
                              <div className="text-xs text-slate-500">Maak een nieuw account</div>
                            </div>
                          </Link>
                          
                          <div className="border-t border-slate-200/60 my-1.5" />
                          
                          <Link
                            href="/book"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all duration-200 group mx-2 mb-2 rounded-lg"
                          >
                            <Calendar className="h-4 w-4 text-blue-600 group-hover:text-blue-700 transition-colors flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-sm">Afspraak Maken</div>
                              <div className="text-xs text-blue-600/80">Plan direct je afspraak</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
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
                  ref={mobileUserButtonRef}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Close mobile menu when opening user menu
                    if (mobileMenuOpen) {
                      setMobileMenuOpen(false)
                    }
                    // Toggle menu state
                    setUserMenuOpen((prev) => !prev)
                  }}
                  onMouseDown={(e) => {
                    // Prevent menu from closing immediately when button is clicked
                    e.preventDefault()
                  }}
                  onTouchStart={(e) => {
                    // Prevent menu from closing immediately on touch
                    e.stopPropagation()
                  }}
                  className="p-3 rounded-xl hover:bg-slate-100 transition-colors touch-manipulation active:scale-[0.98] relative"
                  aria-label="Gebruikersmenu"
                  aria-expanded={userMenuOpen}
                >
                  <User className="h-6 w-6 text-slate-700" />
                </button>
                
                {/* User Dropdown Menu Mobile */}
                {userMenuOpen && (
                  <div 
                    className="fixed sm:absolute right-2 sm:right-0 top-20 sm:top-full mt-0 sm:mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden z-[9999] animate-fadeInDown backdrop-blur-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Gebruikersinfo Header */}
                    <div className="px-5 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-b border-blue-400/20">
                      <p className="font-bold text-white text-base mb-1 leading-tight">{session.user.name || 'Gebruiker'}</p>
                      <p className="text-xs text-blue-100 truncate leading-tight">{session.user.email}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                      >
                        <LayoutDashboard className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Mijn Koubyte</div>
                          <div className="text-xs text-slate-500">Dashboard overzicht</div>
                        </div>
                      </Link>
                      
                      <Link
                        href="/dashboard/privacy"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                      >
                        <Settings className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Gegevens & Voorkeuren</div>
                          <div className="text-xs text-slate-500">Privacy instellingen</div>
                        </div>
                      </Link>
                      
                      <div className="border-t border-slate-200/60 my-1.5" />
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                      >
                        <Calendar className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Mijn Afspraken</div>
                          <div className="text-xs text-slate-500">Bekijk & beheer</div>
                        </div>
                      </Link>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                      >
                        <Package className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Mijn Bestellingen</div>
                          <div className="text-xs text-slate-500">Bestelgeschiedenis</div>
                        </div>
                      </Link>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                      >
                        <Heart className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Verlanglijstje</div>
                          <div className="text-xs text-slate-500">Opgeslagen items</div>
                        </div>
                      </Link>
                      
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                      >
                        <Star className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Mijn Reviews</div>
                          <div className="text-xs text-slate-500">Bekijk je reviews</div>
                        </div>
                      </Link>
                      
                      <div className="border-t border-slate-200/60 my-1.5" />
                      
                      <Link
                        href="/faq"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 group"
                      >
                        <HelpCircle className="h-5 w-5 text-slate-400 group-hover:text-slate-700 transition-colors flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">Help & Support</div>
                          <div className="text-xs text-slate-500">Vragen of hulp nodig?</div>
                        </div>
                      </Link>
                      
                      <div className="border-t border-slate-200/60 my-1.5" />
                      
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                      >
                        <LogOut className="h-5 w-5 group-hover:text-red-700 transition-colors flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-sm">Uitloggen</div>
                          <div className="text-xs text-red-500/80">Afmelden van je account</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Hamburger Menu Knop */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setMobileMenuOpen(!mobileMenuOpen)
              }}
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

        {/* Mobile Menu - Met dropdown structuur */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 space-y-1 animate-fadeInDown border-t border-slate-100 w-full overflow-x-hidden">
            {/* Home */}
            <Link 
              href={homeUrl} 
              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg">🏠</span>
              <span>Home</span>
            </Link>
            
            {/* Diensten Dropdown Mobile */}
            <div className="space-y-1">
              <button
                onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5" />
                  <span>Diensten</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${servicesMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {servicesMenuOpen && (
                <div className="ml-4 space-y-1 bg-slate-50 rounded-lg py-2">
                  <Link 
                    href="/diensten" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setServicesMenuOpen(false)
                    }}
                  >
                    <Wrench className="h-4 w-4" />
                    <span className="text-sm font-medium">Onze Diensten</span>
                  </Link>
                  <Link 
                    href="/pricing" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setServicesMenuOpen(false)
                    }}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-medium">Prijzen</span>
                  </Link>
                  <Link 
                    href="/quote" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setServicesMenuOpen(false)
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">Offerte Aanvragen</span>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Informatie Dropdown Mobile */}
            <div className="space-y-1">
              <button
                onClick={() => setInfoMenuOpen(!infoMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5" />
                  <span>Informatie</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${infoMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {infoMenuOpen && (
                <div className="ml-4 space-y-1 bg-slate-50 rounded-lg py-2">
                  <Link 
                    href="/about" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setInfoMenuOpen(false)
                    }}
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Over Mij</span>
                  </Link>
                  <Link 
                    href="/faq" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setInfoMenuOpen(false)
                    }}
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Veelgestelde Vragen</span>
                  </Link>
                  <Link 
                    href="/blog" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setInfoMenuOpen(false)
                    }}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">Blog</span>
                  </Link>
                  <Link 
                    href="/contact" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      setInfoMenuOpen(false)
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Contact</span>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile Account Section */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              {session ? (
                <>
                  {session.user.role === 'admin' ? (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-md">
                        Admin Panel
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/checkout" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md">
                          🛒 Winkelwagen
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-lg font-semibold text-slate-700 border-2">
                      Inloggen
                    </Button>
                  </Link>
                  <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md">
                      📅 Afspraak maken
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
