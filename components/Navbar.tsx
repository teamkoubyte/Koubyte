'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/diensten', label: 'Diensten' },
    { href: '/about', label: 'Over mij' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 w-full ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold">
              <span className="text-blue-600">Kou</span>
              <span className="text-slate-800">byte</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-4">
              <Link href="/book">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Afspraak maken
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-lg hover:bg-slate-100"
            aria-label="Menu openen"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-slate-700" /> : <Menu className="h-5 w-5 text-slate-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 px-2">
              <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Afspraak maken
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
