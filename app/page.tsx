import { Button } from '@/components/ui/button'
import { Wrench, Shield, Zap, Database, Wifi, Monitor, Lock, HelpCircle, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import ReviewsSection from '@/components/ReviewsSection'
import RealStats from '@/components/RealStats'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Koubyte biedt professionele IT-diensten voor particulieren en bedrijven. Van hardware reparatie tot complete netwerkinstallaties. Snel, betrouwbaar en transparant.',
  openGraph: {
    title: 'Koubyte - Professionele IT-diensten',
    description: 'Betrouwbare IT-oplossingen voor particulieren en bedrijven',
  },
}

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden max-w-full w-full">
      {/* Hero Sectie */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-slate-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16 lg:py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Links - Tekst */}
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-block">
                <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Professionele IT-diensten sinds 2020</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-tight">
                Betrouwbare<br />
                <span className="text-blue-600">IT-oplossingen</span><br />
                voor jouw bedrijf
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl">
                Van hardware reparatie tot complete netwerkinstallaties.
                Ik help particulieren en kleine bedrijven met alle computerproblemen,
                snel en vakkundig opgelost.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/book" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    Plan een afspraak
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-lg shadow-md transition-all duration-300">
                    Neem contact op
                  </Button>
                </Link>
              </div>

              <RealStats />
            </div>

            {/* Rechts - Info Cards */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Gegarandeerde kwaliteit</h3>
                    <p className="text-sm sm:text-base text-slate-600">Alle werkzaamheden worden professioneel uitgevoerd met garantie op het werk.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Snelle service</h3>
                    <p className="text-sm sm:text-base text-slate-600">Reactie binnen 24 uur. Voor urgente zaken zijn we vaak dezelfde dag beschikbaar.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Transparante prijzen</h3>
                    <p className="text-sm sm:text-base text-slate-600">Duidelijke prijsafspraken vooraf. Geen verborgen kosten of verrassingen achteraf.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diensten Overzicht */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-white overflow-x-hidden w-full">
        <div className="container mx-auto max-w-7xl w-full">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
              Wat we voor je kunnen betekenen
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Een compleet overzicht van alle IT-diensten die we aanbieden voor particulieren en bedrijven
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: Monitor, color: 'blue', title: 'Hardware & Reparatie', desc: 'Volledige diagnose en reparatie van computers, laptops en randapparatuur. Ook voor upgrades en uitbreidingen.' },
              { icon: Zap, color: 'green', title: 'Software & Systemen', desc: 'Installatie en configuratie van software, besturingssystemen en updates. Inclusief optimalisatie en probleemoplossing.' },
              { icon: Wifi, color: 'indigo', title: 'Netwerk & Wifi', desc: 'Complete netwerkinstallaties, wifi-optimalisatie en router configuratie. Voor thuis en op kantoor.' },
              { icon: Lock, color: 'red', title: 'Beveiliging & Virussen', desc: 'Verwijdering van virussen en malware, installatie van beveiligingssoftware en preventief advies.' },
              { icon: Database, color: 'amber', title: 'Data & Backup', desc: 'Dataherstel bij verlies, automatische backup oplossingen en veilige datamigratie tussen systemen.' },
              { icon: Wrench, color: 'purple', title: 'Onderhoud & Advies', desc: 'Preventief onderhoud, periodieke controles en professioneel advies over je IT-infrastructuur.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className={`group bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-200 hover:border-${color}-500 hover:shadow-xl transition-all duration-300`}>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-${color}-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 text-${color}-600`} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">{title}</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4">{desc}</p>
                <Link href="/diensten" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center text-sm sm:text-base">
                  Meer informatie <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waarom Koubyte */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Echte Reviews</h3>
                </div>
                <p className="text-sm sm:text-base text-slate-600 mb-4">
                  Alle statistieken en reviews op deze website zijn 100% echt en komen direct uit onze database.
                </p>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">Geverifieerde Klantervaringen</span>
                </div>
              </div>

              <div className="bg-blue-600 p-6 sm:p-8 rounded-2xl text-white shadow-xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Direct contact nodig?</h3>
                <p className="mb-4 sm:mb-6 text-blue-100 text-sm sm:text-base">Bel of stuur gerust een berichtje voor een snelle oplossing van je probleem.</p>
                <a href="tel:+32484522662" className="text-xl sm:text-2xl font-bold hover:text-blue-100 transition-colors">
                  +32 484 52 26 62
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
                Waarom kiezen voor Koubyte?
              </h2>
              <p className="text-base sm:text-xl text-slate-600 mb-6 sm:mb-8">
                Al jaren de betrouwbare IT-partner voor particulieren en kleine bedrijven in de regio.
              </p>

              <div className="space-y-4 sm:space-y-6">
                {[
                  { title: 'Persoonlijke aanpak', description: 'Je hebt direct contact met mij, geen callcenters of wachttijden. Persoonlijke service staat voorop.' },
                  { title: 'Ruime ervaring', description: 'Jarenlange ervaring met alle gangbare merken, systemen en software. Van Windows tot Mac, van HP tot Dell.' },
                  { title: 'Eerlijke prijzen', description: 'Duidelijke prijsafspraken vooraf. Je betaalt alleen voor de tijd en materialen die daadwerkelijk nodig zijn.' },
                  { title: 'Snelle respons', description: 'Meestal binnen 24 uur reactie en bij urgente zaken vaak nog dezelfde dag een oplossing.' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm sm:text-base text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* CTA */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <HelpCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 opacity-80" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Computerproblemen? Ik help je graag
          </h2>
          <p className="text-base sm:text-xl mb-8 sm:mb-10 text-blue-100">
            Neem contact op voor advies, een afspraak of een vrijblijvende offerte.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/book" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-lg shadow-xl">
                Plan een afspraak
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/diensten" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 border-2 border-white px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-lg shadow-lg">
                Bekijk diensten
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
