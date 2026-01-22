'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, LogIn, ShoppingCart, User, LayoutDashboard, Settings, Heart, Package, Calendar, Star, HelpCircle, LogOut, ChevronDown, Wrench, DollarSign, FileText, Info, Users, BookOpen, MessageSquare } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import ShoppingCartWidget from './ShoppingCart'
import NotificationCenter from './NotificationCenter'

interface NavbarProps {
  session: any
}

type DropdownType = 'services' | 'info' | 'account' | 'user' | null

export default function Navbar({ session }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null)
  const [mobileDropdown, setMobileDropdown] = useState<'services' | 'info' | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  
  const navRef = useRef<HTMLElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
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
      const fetchCart = () => {
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
      
      fetchCart()
      window.addEventListener('cart-updated', fetchCart)
      return () => window.removeEventListener('cart-updated', fetchCart)
    }
  }, [session])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
        setMobileMenuOpen(false)
        setMobileDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdowns on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null)
        setMobileMenuOpen(false)
        setMobileDropdown(null)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Desktop hover handlers with delay
  const handleMouseEnter = useCallback((dropdown: DropdownType) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveDropdown(dropdown)
  }, [])

  const handleMouseLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }, [])

  // Toggle dropdown on click (for accessibility)
  const toggleDropdown = useCallback((dropdown: DropdownType) => {
    setActiveDropdown(prev => prev === dropdown ? null : dropdown)
  }, [])

  // Close all and navigate
  const closeAndNavigate = useCallback(() => {
    setActiveDropdown(null)
    setMobileMenuOpen(false)
    setMobileDropdown(null)
  }, [])

  return (
    <nav 
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-300 w-full ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200' 
          : 'bg-white border-b border-slate-100'
      }`}
      id="main-navbar"
    >
      <div className="container mx-auto max-w-7xl px-4" data-cart="container">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href={homeUrl} className="flex items-center flex-shrink-0">
            <span className="text-2xl lg:text-3xl font-bold logo-sharp">
              <span className="text-blue-600">Kou</span>
              <span className="text-slate-800">byte</span>
            </span>
          </Link>

          {/* Desktop Menu - Visible from lg (1024px) */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Home - Direct link */}
            <Link 
              href={homeUrl} 
              className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Home
            </Link>

            {/* Diensten Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('services')}
                className={`flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeDropdown === 'services' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                aria-expanded={activeDropdown === 'services'}
                aria-haspopup="true"
              >
                <Wrench className="h-4 w-4" />
                <span>Diensten</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'services' && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-dropdown">
                    <div className="py-2">
                      <Link
                        href="/diensten"
                        onClick={closeAndNavigate}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                      >
                        <Wrench className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">Onze Diensten</div>
                          <div className="text-xs text-slate-500">Bekijk alle IT-diensten</div>
                        </div>
                      </Link>
                      
                      <Link
                        href="/pricing"
                        onClick={closeAndNavigate}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                      >
                        <DollarSign className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">Prijzen</div>
                          <div className="text-xs text-slate-500">Transparante tarieven</div>
                        </div>
                      </Link>
                      
                      <Link
                        href="/quote"
                        onClick={closeAndNavigate}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                      >
                        <FileText className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">Offerte Aanvragen</div>
                          <div className="text-xs text-slate-500">Gratis prijsopgave</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Informatie Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('info')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('info')}
                className={`flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeDropdown === 'info' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                aria-expanded={activeDropdown === 'info'}
                aria-haspopup="true"
              >
                <Info className="h-4 w-4" />
                <span>Informatie</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'info' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'info' && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-dropdown">
                    <div className="py-2">
                      <Link
                        href="/about"
                        onClick={closeAndNavigate}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                      >
                        <Users className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">Over Mij</div>
                          <div className="text-xs text-slate-500">Leer meer over Koubyte</div>
                        </div>
                      </Link>
                      
                      <Link
                        href="/faq"
                        onClick={closeAndNavigate}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                      >
                        <HelpCircle className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">Veelgestelde Vragen</div>
                          <div className="text-xs text-slate-500">Vind snel antwoorden</div>
                        </div>
                      </Link>
                      
                      <Link
                        href="/blog"
                        onClick={closeAndNavigate}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                      >
                        <BookOpen className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">Blog</div>
                          <div className="text-xs text-slate-500">IT-tips & handleidingen</div>
                        </div>
                      </Link>
                      
                      <Link
                        href="/contact"
                        onClick={closeAndNavigate}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                      >
                        <MessageSquare className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">Contact</div>
                          <div className="text-xs text-slate-500">Neem contact op</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Spacer */}
            <div className="w-4" />

            {/* Account Actions */}
            <div className="flex items-center gap-2">
              {/* Shopping Cart Widget - alleen voor ingelogde niet-admin gebruikers */}
              {session && session.user.role !== 'admin' && (
                <ShoppingCartWidget />
              )}
              
              {/* Notification Center - alleen voor ingelogde niet-admin gebruikers */}
              {session && session.user.role !== 'admin' && (
                <NotificationCenter />
              )}
              
              {session ? (
                <>
                  {session.user.role === 'admin' ? (
                    <Link href="/admin">
                      <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                        Admin Panel
                      </Button>
                    </Link>
                  ) : (
                    /* User Menu Dropdown */
                    <div 
                      className="relative"
                      onMouseEnter={() => handleMouseEnter('user')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        onClick={() => toggleDropdown('user')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium border transition-colors ${
                          activeDropdown === 'user'
                            ? 'border-blue-300 bg-blue-50 text-blue-700'
                            : 'border-slate-300 hover:bg-slate-50 hover:border-blue-300 text-slate-700'
                        }`}
                        aria-label="Gebruikersmenu"
                        aria-expanded={activeDropdown === 'user'}
                        aria-haspopup="true"
                      >
                        <User className="h-5 w-5" />
                        <span className="max-w-[120px] truncate">{session.user.name || 'Account'}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'user' ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {activeDropdown === 'user' && (
                        <div className="absolute right-0 top-full pt-2 z-50">
                          <div className="w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-dropdown">
                            {/* User Info Header */}
                            <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-500">
                              <p className="font-bold text-white text-base truncate">{session.user.name || 'Gebruiker'}</p>
                              <p className="text-xs text-blue-100 truncate">{session.user.email}</p>
                            </div>
                            
                            {/* Menu Items */}
                            <div className="py-2">
                              <Link
                                href="/dashboard"
                                onClick={closeAndNavigate}
                                className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                              >
                                <LayoutDashboard className="h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold text-sm">Mijn Koubyte</div>
                                  <div className="text-xs text-slate-500">Dashboard overzicht</div>
                                </div>
                              </Link>
                              
                              <Link
                                href="/dashboard/privacy"
                                onClick={closeAndNavigate}
                                className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                              >
                                <Settings className="h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold text-sm">Gegevens & Voorkeuren</div>
                                  <div className="text-xs text-slate-500">Privacy instellingen</div>
                                </div>
                              </Link>
                              
                              <div className="border-t border-slate-200 my-2" />
                              
                              <Link
                                href="/dashboard"
                                onClick={closeAndNavigate}
                                className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                              >
                                <Calendar className="h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold text-sm">Mijn Afspraken</div>
                                  <div className="text-xs text-slate-500">Bekijk & beheer</div>
                                </div>
                              </Link>
                              
                              <Link
                                href="/dashboard"
                                onClick={closeAndNavigate}
                                className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                              >
                                <Package className="h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold text-sm">Mijn Bestellingen</div>
                                  <div className="text-xs text-slate-500">Bestelgeschiedenis</div>
                                </div>
                              </Link>
                              
                              <Link
                                href="/dashboard"
                                onClick={closeAndNavigate}
                                className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                              >
                                <Heart className="h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold text-sm">Verlanglijstje</div>
                                  <div className="text-xs text-slate-500">Opgeslagen items</div>
                                </div>
                              </Link>
                              
                              <Link
                                href="/dashboard"
                                onClick={closeAndNavigate}
                                className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                              >
                                <Star className="h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold text-sm">Mijn Reviews</div>
                                  <div className="text-xs text-slate-500">Bekijk je reviews</div>
                                </div>
                              </Link>
                              
                              <div className="border-t border-slate-200 my-2" />
                              
                              <Link
                                href="/faq"
                                onClick={closeAndNavigate}
                                className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 transition-colors group"
                              >
                                <HelpCircle className="h-5 w-5 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold text-sm">Help & Support</div>
                                  <div className="text-xs text-slate-500">Vragen of hulp nodig?</div>
                                </div>
                              </Link>
                              
                              <div className="border-t border-slate-200 my-2" />
                              
                              <button
                                onClick={() => {
                                  closeAndNavigate()
                                  signOut({ callbackUrl: '/' })
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition-colors group"
                              >
                                <LogOut className="h-5 w-5 flex-shrink-0" />
                                <div className="text-left">
                                  <div className="font-semibold text-sm">Uitloggen</div>
                                  <div className="text-xs text-red-500/80">Afmelden van je account</div>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                /* Account Dropdown voor niet-ingelogde gebruikers */
                <div 
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('account')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => toggleDropdown('account')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium border transition-colors ${
                      activeDropdown === 'account'
                        ? 'border-blue-300 bg-blue-50 text-blue-700'
                        : 'border-slate-300 hover:bg-slate-50 hover:border-blue-300 text-slate-700'
                    }`}
                    aria-expanded={activeDropdown === 'account'}
                    aria-haspopup="true"
                  >
                    <User className="h-5 w-5" />
                    <span>Account</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'account' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeDropdown === 'account' && (
                    <div className="absolute right-0 top-full pt-2 z-50">
                      <div className="w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-dropdown">
                        <div className="py-2">
                          <Link
                            href="/auth/login"
                            onClick={closeAndNavigate}
                            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                          >
                            <LogIn className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-sm">Inloggen</div>
                              <div className="text-xs text-slate-500">Log in op je account</div>
                            </div>
                          </Link>
                          
                          <Link
                            href="/auth/register"
                            onClick={closeAndNavigate}
                            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                          >
                            <User className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-sm">Registreren</div>
                              <div className="text-xs text-slate-500">Maak een nieuw account</div>
                            </div>
                          </Link>
                          
                          <div className="border-t border-slate-200 my-2" />
                          
                          <div className="px-2 pb-2">
                            <Link
                              href="/book"
                              onClick={closeAndNavigate}
                              className="flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors group"
                            >
                              <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <div>
                                <div className="font-semibold text-sm">Afspraak Maken</div>
                                <div className="text-xs text-blue-600/80">Plan direct je afspraak</div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Icons + Menu Button - Hidden from lg */}
          <div className="lg:hidden flex items-center gap-1">
            {/* Shopping Cart Icon - Alleen voor ingelogde niet-admin gebruikers */}
            {session && session.user.role !== 'admin' && (
              <Link 
                href="/checkout" 
                className="relative p-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={closeAndNavigate}
              >
                <ShoppingCart className="h-5 w-5 text-slate-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* User Icon - Alleen voor ingelogde niet-admin gebruikers */}
            {session && session.user.role !== 'admin' && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setActiveDropdown(activeDropdown === 'user' ? null : 'user')
                }}
                className="p-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Gebruikersmenu"
              >
                <User className="h-5 w-5 text-slate-700" />
              </button>
            )}
            
            {/* Login Icon - Alleen als niet ingelogd */}
            {!session && (
              <Link 
                href="/auth/login" 
                className="p-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={closeAndNavigate}
              >
                <LogIn className="h-5 w-5 text-slate-700" />
              </Link>
            )}
            
            {/* Hamburger Menu Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen)
                setActiveDropdown(null)
              }}
              className="p-2.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Sluit menu' : 'Open menu'}
            >
              {mobileMenuOpen ? 
                <X className="h-5 w-5 text-slate-700" /> : 
                <Menu className="h-5 w-5 text-slate-700" />
              }
            </button>
          </div>
        </div>

        {/* Mobile User Dropdown - Appears below navbar */}
        {activeDropdown === 'user' && session && session.user.role !== 'admin' && (
          <div className="lg:hidden absolute left-0 right-0 top-full bg-white border-b border-slate-200 shadow-lg z-50 animate-dropdown">
            <div className="max-w-7xl mx-auto">
              {/* User Info Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500">
                <p className="font-bold text-white truncate">{session.user.name || 'Gebruiker'}</p>
                <p className="text-xs text-blue-100 truncate">{session.user.email}</p>
              </div>
              
              {/* Menu Items */}
              <div className="py-2 px-2">
                <Link
                  href="/dashboard"
                  onClick={closeAndNavigate}
                  className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <span className="font-medium">Mijn Koubyte</span>
                </Link>
                
                <Link
                  href="/dashboard/privacy"
                  onClick={closeAndNavigate}
                  className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Settings className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <span className="font-medium">Gegevens & Voorkeuren</span>
                </Link>
                
                <Link
                  href="/dashboard"
                  onClick={closeAndNavigate}
                  className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Calendar className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <span className="font-medium">Mijn Afspraken</span>
                </Link>
                
                <Link
                  href="/dashboard"
                  onClick={closeAndNavigate}
                  className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Package className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <span className="font-medium">Mijn Bestellingen</span>
                </Link>
                
                <div className="border-t border-slate-200 my-2" />
                
                <button
                  onClick={() => {
                    closeAndNavigate()
                    signOut({ callbackUrl: '/' })
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">Uitloggen</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 animate-dropdown">
            {/* Home */}
            <Link 
              href={homeUrl} 
              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors"
              onClick={closeAndNavigate}
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
            
            {/* Diensten Dropdown Mobile */}
            <div>
              <button
                onClick={() => setMobileDropdown(mobileDropdown === 'services' ? null : 'services')}
                className="w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5" />
                  <span>Diensten</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileDropdown === 'services' && (
                <div className="ml-4 mt-1 space-y-1 bg-slate-50 rounded-lg py-2">
                  <Link 
                    href="/diensten" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                    onClick={closeAndNavigate}
                  >
                    <Wrench className="h-4 w-4" />
                    <span className="text-sm font-medium">Onze Diensten</span>
                  </Link>
                  <Link 
                    href="/pricing" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                    onClick={closeAndNavigate}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-medium">Prijzen</span>
                  </Link>
                  <Link 
                    href="/quote" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                    onClick={closeAndNavigate}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">Offerte Aanvragen</span>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Informatie Dropdown Mobile */}
            <div>
              <button
                onClick={() => setMobileDropdown(mobileDropdown === 'info' ? null : 'info')}
                className="w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5" />
                  <span>Informatie</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileDropdown === 'info' ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileDropdown === 'info' && (
                <div className="ml-4 mt-1 space-y-1 bg-slate-50 rounded-lg py-2">
                  <Link 
                    href="/about" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                    onClick={closeAndNavigate}
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Over Mij</span>
                  </Link>
                  <Link 
                    href="/faq" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                    onClick={closeAndNavigate}
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Veelgestelde Vragen</span>
                  </Link>
                  <Link 
                    href="/blog" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                    onClick={closeAndNavigate}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">Blog</span>
                  </Link>
                  <Link 
                    href="/contact" 
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                    onClick={closeAndNavigate}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Contact</span>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile Account Section */}
            <div className="pt-4 mt-4 border-t border-slate-200 space-y-2 px-2">
              {session ? (
                <>
                  {session.user.role === 'admin' ? (
                    <Link href="/admin" onClick={closeAndNavigate}>
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold">
                        Admin Panel
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/checkout" onClick={closeAndNavigate}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                        🛒 Winkelwagen
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={closeAndNavigate}>
                    <Button variant="outline" className="w-full rounded-lg font-semibold text-slate-700 border-2">
                      Inloggen
                    </Button>
                  </Link>
                  <Link href="/book" onClick={closeAndNavigate}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold mt-2">
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
