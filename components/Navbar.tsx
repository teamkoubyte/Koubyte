'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, LogIn, ShoppingCart, User, LayoutDashboard, Settings, Package, Calendar, LogOut, ChevronDown, Wrench, FileText, Info, Users, HelpCircle, BookOpen, MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import ShoppingCartWidget from './ShoppingCart'
import NotificationCenter from './NotificationCenter'

interface NavbarProps {
  session: any
}

// Custom CSS voor dropdown hover - dit werkt ALTIJD
const dropdownStyles = `
  #main-navbar,
  #main-navbar .container,
  #main-navbar .nav-dropdown,
  #main-navbar .nav-dropdown-content {
    overflow: visible;
  }
  #main-navbar .nav-dropdown-content,
  #main-navbar .nav-dropdown-content > div {
    max-width: none;
  }
  .nav-dropdown {
    position: relative;
  }
  .nav-dropdown-content {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    padding-top: 8px;
    z-index: 9999;
  }
  .nav-dropdown-content.right {
    left: auto;
    right: 0;
  }
  .nav-dropdown:hover .nav-dropdown-content {
    display: block;
  }
`

export default function Navbar({ session }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  
  const homeUrl = session?.user?.role === 'admin' ? '/admin' : '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (session?.user?.id && session.user.role !== 'admin') {
      const fetchCart = () => {
        fetch('/api/cart')
          .then(res => res.json())
          .then(data => {
            if (data.cartItems && Array.isArray(data.cartItems)) {
              setCartItemCount(data.cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0))
            }
          })
          .catch(() => setCartItemCount(0))
      }
      fetchCart()
      window.addEventListener('cart-updated', fetchCart)
      return () => window.removeEventListener('cart-updated', fetchCart)
    }
  }, [session])

  const closeAll = () => {
    setMobileMenuOpen(false)
    setMobileDropdown(null)
  }

  return (
    <>
      {/* Inject CSS */}
      <style>{dropdownStyles}</style>
      
      <nav
        id="main-navbar"
        className={`sticky top-0 z-50 transition-all duration-300 w-full ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200' : 'bg-white border-b border-slate-100'
      }`}
      >
        <div className="container mx-auto !max-w-7xl px-4" data-cart="container">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link href={homeUrl} className="flex-shrink-0">
              <span className="text-2xl lg:text-3xl font-bold">
                <span className="text-blue-600">Kou</span>
                <span className="text-slate-800">byte</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              <Link href={homeUrl} className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                Home
              </Link>

              {/* Diensten Dropdown */}
              <div className="nav-dropdown">
                <button className="flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Wrench className="h-4 w-4" />
                  <span>Diensten</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="nav-dropdown-content">
                  <div className="w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="py-2">
                      <Link href="/diensten" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                        <Wrench className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="font-semibold text-sm">Onze Diensten</div>
                          <div className="text-xs text-slate-500">Bekijk alle IT-diensten</div>
                        </div>
                      </Link>
                      <Link href="/quote" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="font-semibold text-sm">Offerte Aanvragen</div>
                          <div className="text-xs text-slate-500">Gratis prijsopgave</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informatie Dropdown */}
              <div className="nav-dropdown">
                <button className="flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Info className="h-4 w-4" />
                  <span>Informatie</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="nav-dropdown-content">
                  <div className="w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="py-2">
                      <Link href="/about" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                        <Users className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="font-semibold text-sm">Over Mij</div>
                          <div className="text-xs text-slate-500">Leer meer over Koubyte</div>
                        </div>
                      </Link>
                      <Link href="/faq" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                        <HelpCircle className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="font-semibold text-sm">Veelgestelde Vragen</div>
                          <div className="text-xs text-slate-500">Vind snel antwoorden</div>
                        </div>
                      </Link>
                      <Link href="/blog" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                        <BookOpen className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="font-semibold text-sm">Blog</div>
                          <div className="text-xs text-slate-500">IT-tips & handleidingen</div>
                        </div>
                      </Link>
                      <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                        <MessageSquare className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="font-semibold text-sm">Contact</div>
                          <div className="text-xs text-slate-500">Neem contact op</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-4" />

              {/* Account Actions */}
              <div className="flex items-center gap-2">
                {session && session.user.role !== 'admin' && <ShoppingCartWidget />}
                {session && session.user.role !== 'admin' && <NotificationCenter />}
                
                {session ? (
                  session.user.role === 'admin' ? (
                    <Link href="/admin">
                      <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold">
                        Admin Panel
                      </Button>
                    </Link>
                  ) : (
                    /* User Menu */
                    <div className="nav-dropdown">
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium border border-slate-300 hover:bg-slate-50 text-slate-700">
                        <User className="h-5 w-5" />
                        <span className="max-w-[100px] truncate">{session.user.name || 'Account'}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div className="nav-dropdown-content right">
                        <div className="w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                          <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500">
                            <p className="font-bold text-white truncate">{session.user.name}</p>
                            <p className="text-xs text-blue-100 truncate">{session.user.email}</p>
                          </div>
                          <div className="py-2">
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                              <LayoutDashboard className="h-4 w-4" />
                              <span className="text-sm font-medium">Mijn Koubyte</span>
                            </Link>
                            <Link href="/dashboard/privacy" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                              <Settings className="h-4 w-4" />
                              <span className="text-sm font-medium">Instellingen</span>
                            </Link>
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm font-medium">Mijn Afspraken</span>
                            </Link>
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                              <Package className="h-4 w-4" />
                              <span className="text-sm font-medium">Mijn Bestellingen</span>
                            </Link>
                            <div className="border-t border-slate-200 my-1" />
                            <button
                              onClick={() => signOut({ callbackUrl: '/' })}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50"
                            >
                              <LogOut className="h-4 w-4" />
                              <span className="text-sm font-medium">Uitloggen</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  /* Account dropdown voor niet-ingelogde users */
                  <div className="nav-dropdown">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium border border-slate-300 hover:bg-slate-50 text-slate-700">
                      <User className="h-5 w-5" />
                      <span>Account</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="nav-dropdown-content right">
                      <div className="w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                        <div className="py-2">
                          <Link href="/auth/login" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                            <LogIn className="h-4 w-4 text-slate-400" />
                            <div>
                              <div className="font-semibold text-sm">Inloggen</div>
                              <div className="text-xs text-slate-500">Log in op je account</div>
                            </div>
                          </Link>
                          <Link href="/auth/register" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                            <User className="h-4 w-4 text-slate-400" />
                            <div>
                              <div className="font-semibold text-sm">Registreren</div>
                              <div className="text-xs text-slate-500">Maak een nieuw account</div>
                            </div>
                          </Link>
                          <div className="border-t border-slate-200 my-2" />
                          <div className="px-2 pb-2">
                            <Link href="/book" className="flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <div>
                                <div className="font-semibold text-sm">Afspraak Maken</div>
                                <div className="text-xs text-blue-600/80">Plan direct je afspraak</div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-1">
              {session && session.user.role !== 'admin' && (
                <Link href="/checkout" className="relative p-2.5 rounded-lg hover:bg-slate-100">
                  <ShoppingCart className="h-5 w-5 text-slate-700" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </Link>
              )}
              
              {!session && (
                <Link href="/auth/login" className="p-2.5 rounded-lg hover:bg-slate-100">
                  <LogIn className="h-5 w-5 text-slate-700" />
                </Link>
              )}
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="h-5 w-5 text-slate-700" /> : <Menu className="h-5 w-5 text-slate-700" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-100">
              <Link href={homeUrl} onClick={closeAll} className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 rounded-lg font-medium">
                🏠 Home
              </Link>
              
              {/* Diensten Mobile */}
              <div>
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === 'diensten' ? null : 'diensten')}
                  className="w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-blue-50 rounded-lg font-medium"
                >
                  <span className="flex items-center gap-3"><Wrench className="h-5 w-5" /> Diensten</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileDropdown === 'diensten' ? 'rotate-180' : ''}`} />
                </button>
                {mobileDropdown === 'diensten' && (
                  <div className="ml-4 mt-1 bg-slate-50 rounded-lg py-2">
                    <Link href="/diensten" onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600">
                      <Wrench className="h-4 w-4" />
                      <span className="text-sm font-medium">Onze Diensten</span>
                    </Link>
                    <Link href="/quote" onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">Offerte Aanvragen</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Info Mobile */}
              <div>
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === 'info' ? null : 'info')}
                  className="w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-blue-50 rounded-lg font-medium"
                >
                  <span className="flex items-center gap-3"><Info className="h-5 w-5" /> Informatie</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileDropdown === 'info' ? 'rotate-180' : ''}`} />
                </button>
                {mobileDropdown === 'info' && (
                  <div className="ml-4 mt-1 bg-slate-50 rounded-lg py-2">
                    <Link href="/about" onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">Over Mij</span>
                    </Link>
                    <Link href="/faq" onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600">
                      <HelpCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Veelgestelde Vragen</span>
                    </Link>
                    <Link href="/blog" onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm font-medium">Blog</span>
                    </Link>
                    <Link href="/contact" onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">Contact</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Account Section */}
              <div className="pt-4 mt-4 border-t border-slate-200 px-2 space-y-2">
                {session ? (
                  session.user.role === 'admin' ? (
                    <Link href="/admin" onClick={closeAll}>
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold">
                        Admin Panel
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/dashboard" onClick={closeAll}>
                        <Button variant="outline" className="w-full rounded-lg font-semibold">
                          Mijn Dashboard
                        </Button>
                      </Link>
                      <button onClick={() => { closeAll(); signOut({ callbackUrl: '/' }) }} className="w-full">
                        <Button variant="outline" className="w-full rounded-lg font-semibold text-red-600 border-red-200 hover:bg-red-50">
                          Uitloggen
                        </Button>
                      </button>
                    </>
                  )
                ) : (
                  <>
                    <Link href="/auth/login" onClick={closeAll}>
                      <Button variant="outline" className="w-full rounded-lg font-semibold">Inloggen</Button>
                    </Link>
                    <Link href="/book" onClick={closeAll}>
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
    </>
  )
}
