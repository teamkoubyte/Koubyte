'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, LogOut, Users, Calendar, MessageSquare, Star, Package, Wrench, FileText, Calculator, CreditCard, Tag } from 'lucide-react'
import { useState } from 'react'

interface AdminNavbarProps {
  userName?: string
}

export default function AdminNavbar({ userName }: AdminNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(path)
  }

  return (
    <nav 
      className="bg-white border-b-2 border-slate-200 shadow-sm sticky top-0 z-50 w-full overflow-x-hidden"
      id="admin-navbar"
    >
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 w-full overflow-x-hidden" data-cart="container">
        <div className="flex justify-between items-center h-16 min-w-0">
          {/* Logo - Admin Panel */}
          <Link href="/admin" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <span className="text-base sm:text-xl font-bold logo-sharp">
                <span className="text-blue-600">Kou</span>
                <span className="text-slate-900">byte</span>
              </span>
              <span className="hidden sm:block text-xs text-slate-500">Admin Panel</span>
            </div>
          </Link>

          {/* Desktop Menu - Verberg eerder voor betere responsive design */}
          <div className="hidden lg:flex items-center space-x-1 min-w-0 flex-1 justify-end flex-wrap">
            <Link 
              href="/admin" 
              className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin') 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 inline mr-2" />
              Dashboard
            </Link>
            <Link
              href="/admin/appointments" 
              className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/appointments') 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Afspraken
            </Link>
            <Link
              href="/admin/calendar" 
              className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/calendar') 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Kalender
            </Link>
            <Link 
              href="/admin/users" 
              className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/users') 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Gebruikers
            </Link>
            <Link 
              href="/admin/messages" 
              className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/messages') 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Berichten
            </Link>
            <Link
              href="/admin/reviews"
              className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/reviews') 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Star className="w-4 h-4 inline mr-2" />
              Reviews
            </Link>
            <Link
              href="/admin/orders"
              className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/orders') 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Bestellingen
            </Link>
            <Link
              href="/admin/services"
              className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/services') 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Wrench className="w-4 h-4 inline mr-2" />
              Diensten
            </Link>
            <Link
              href="/admin/quotes"
              className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/quotes') 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Calculator className="w-4 h-4 inline mr-2" />
              Offertes
            </Link>
            <Link
              href="/admin/payments"
              className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/payments') 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Betalingen
            </Link>

            <div className="ml-4 flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="text-sm">
                <div className="text-slate-500 text-xs">Ingelogd als</div>
                <div className="font-semibold text-slate-900">{userName || 'Admin'}</div>
              </div>
              <Button
                onClick={handleSignOut}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Uitloggen
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button - Toon eerder (lg in plaats van md) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 sm:p-3 rounded-lg hover:bg-slate-100 transition-colors text-slate-900"
            aria-label="Menu"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu - Toon eerder (lg in plaats van md) */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-1.5 sm:space-y-2 border-t border-slate-200 w-full overflow-x-hidden">
            <Link 
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 inline mr-2" />
              Dashboard
            </Link>
            <Link 
              href="/admin/appointments"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/appointments')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Afspraken
            </Link>
            <Link 
              href="/admin/calendar"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/calendar')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Kalender
            </Link>
            <Link 
              href="/admin/users"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/users')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Gebruikers
            </Link>
            <Link 
              href="/admin/messages"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/messages')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Berichten
            </Link>
            <Link
              href="/admin/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/reviews')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Star className="w-4 h-4 inline mr-2" />
              Reviews
            </Link>
            <Link
              href="/admin/orders"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/orders')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Bestellingen
            </Link>
            <Link
              href="/admin/services"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/services')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Wrench className="w-4 h-4 inline mr-2" />
              Diensten
            </Link>
            <Link
              href="/admin/quotes"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/quotes')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Calculator className="w-4 h-4 inline mr-2" />
              Offertes
            </Link>
            <Link
              href="/admin/payments"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium rounded-lg transition-all flex items-center ${
                isActive('/admin/payments')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Betalingen
            </Link>

            <div className="pt-4 border-t border-slate-200">
              <div className="px-4 py-2 text-sm">
                <div className="text-slate-500 text-xs mb-1">Ingelogd als</div>
                <div className="font-semibold text-slate-900 mb-3 text-sm sm:text-base">{userName || 'Admin'}</div>
              </div>
              <Button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleSignOut()
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold py-3 sm:py-2.5 text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Uitloggen
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

