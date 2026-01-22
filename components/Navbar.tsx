'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, LogIn, ShoppingCart, User, LayoutDashboard, Settings, Package, Calendar, LogOut, ChevronDown, Wrench, FileText, Info, Users, HelpCircle, BookOpen, MessageSquare } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'
import ShoppingCartWidget from './ShoppingCart'
import NotificationCenter from './NotificationCenter'

interface NavbarProps {
  session: any
}

export default function Navbar({ session }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  
  const navRef = useRef<HTMLElement>(null)
  const homeUrl = session?.user?.role === 'admin' ? '/admin' : '/'

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cart count
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

  // Click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeAll = () => {
    setMobileMenuOpen(false)
    setMobileDropdown(null)
  }

  const dienstenItems = [
    { href: '/diensten', icon: Wrench, title: 'Onze Diensten', desc: 'Bekijk alle IT-diensten' },
    { href: '/quote', icon: FileText, title: 'Offerte Aanvragen', desc: 'Gratis prijsopgave' },
  ]

  const infoItems = [
    { href: '/about', icon: Users, title: 'Over Mij', desc: 'Leer meer over Koubyte' },
    { href: '/faq', icon: HelpCircle, title: 'Veelgestelde Vragen', desc: 'Vind snel antwoorden' },
    { href: '/blog', icon: BookOpen, title: 'Blog', desc: 'IT-tips & handleidingen' },
    { href: '/contact', icon: MessageSquare, title: 'Contact', desc: 'Neem contact op' },
  ]

  return (
    <nav 
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-300 w-full ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200' : 'bg-white border-b border-slate-100'
      }`}
      id="main-navbar"
    >
      <div className="container mx-auto max-w-7xl px-4" data-cart="container">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href={homeUrl} className="flex-shrink-0">
            <span className="text-2xl lg:text-3xl font-bold">
              <span className="text-blue-600">Kou</span>
              <span className="text-slate-800">byte</span>
            </span>
          </Link>

          {/* Desktop Menu - Pure CSS Dropdowns */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href={homeUrl} className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
              Home
            </Link>

            {/* Diensten Dropdown - Pure CSS */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg transition-colors text-slate-700 hover:text-blue-600 hover:bg-blue-50 group-hover:text-blue-600 group-hover:bg-blue-50">
                <Wrench className="h-4 w-4" />
                <span>Diensten</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              
              {/* Dropdown - appears on hover */}
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="py-2">
                    {dienstenItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <item.icon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Informatie Dropdown - Pure CSS */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-4 py-2 font-medium rounded-lg transition-colors text-slate-700 hover:text-blue-600 hover:bg-blue-50 group-hover:text-blue-600 group-hover:bg-blue-50">
                <Info className="h-4 w-4" />
                <span>Informatie</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="py-2">
                    {infoItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <item.icon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
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
                  /* User Menu - Pure CSS */
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium border transition-colors border-slate-300 hover:bg-slate-50 text-slate-700 group-hover:border-blue-300 group-hover:bg-blue-50 group-hover:text-blue-700">
                      <User className="h-5 w-5" />
                      <span className="max-w-[100px] truncate">{session.user.name || 'Account'}</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    </button>
                    
                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
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
                /* Account dropdown for non-logged in users - Pure CSS */
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium border transition-colors border-slate-300 hover:bg-slate-50 text-slate-700 group-hover:border-blue-300 group-hover:bg-blue-50 group-hover:text-blue-700">
                    <User className="h-5 w-5" />
                    <span>Account</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>
                  
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
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
                  {dienstenItems.map(item => (
                    <Link key={item.href} href={item.href} onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  ))}
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
                  {infoItems.map(item => (
                    <Link key={item.href} href={item.href} onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-blue-600">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  ))}
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
  )
}
