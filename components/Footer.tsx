import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react'
import FooterStats from './FooterStats'

// X (Twitter) SVG Icon
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto w-full overflow-x-hidden">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-12 md:py-16 w-full overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Bedrijfsinfo */}
          <div className="space-y-4">
            <div className="text-3xl font-bold logo-sharp">
              <span className="text-blue-600">Kou</span>
              <span className="text-slate-900">byte</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Professionele IT-diensten voor particulieren en kleine bedrijven. Betrouwbaar, snel en transparant.
            </p>
            {/* Social Links - Echte Koubyte Accounts */}
            <div className="flex space-x-3 pt-4">
              <a 
                href="https://www.facebook.com/people/Koubyte/61576324675690/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 rounded-lg flex items-center justify-center transition-all duration-300"
                aria-label="Volg Koubyte op Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/Koubyte" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 rounded-lg flex items-center justify-center transition-all duration-300"
                aria-label="Volg Koubyte op X (Twitter)"
              >
                <XIcon className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/koubyte/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 hover:bg-pink-600 hover:text-white text-slate-600 rounded-lg flex items-center justify-center transition-all duration-300"
                aria-label="Volg Koubyte op Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://be.linkedin.com/in/koubyte" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 hover:bg-blue-700 hover:text-white text-slate-600 rounded-lg flex items-center justify-center transition-all duration-300"
                aria-label="Volg Koubyte op LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Snelle Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-slate-900">Pagina&apos;s</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'Over mij' },
                { href: '/diensten', label: 'Diensten' },
                { href: '/pricing', label: 'Prijzen' },
                { href: '/faq', label: 'Veelgestelde vragen' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-slate-900">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+32484522662" className="flex items-start gap-3 text-slate-600 hover:text-blue-600 transition-colors group">
                  <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Telefoon</div>
                    <div className="font-semibold">+32 484 52 26 62</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@koubyte.be" className="flex items-start gap-3 text-slate-600 hover:text-blue-600 transition-colors group">
                  <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Email</div>
                    <div className="font-semibold">info@koubyte.be</div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Locatie</div>
                    <div className="font-semibold">Antwerpen, België</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Informatie */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-slate-900">Informatie</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Algemene voorwaarden
                </Link>
              </li>
              <li>
                <Link href="/review" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Schrijf een review
                </Link>
              </li>
            </ul>

            {/* ECHTE Stats uit Database */}
            <FooterStats />
          </div>
        </div>

        {/* Onderbalk */}
        <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs sm:text-sm text-slate-600">
            <p>
              &copy; {currentYear} Koubyte. Alle rechten voorbehouden.
            </p>
            <p>
              Gemaakt met zorg voor betere technologie
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
