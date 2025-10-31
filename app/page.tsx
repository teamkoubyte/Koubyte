import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wrench, Shield, Zap, Database, Wifi, Monitor, Lock, HelpCircle, ArrowRight, Star, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import ReviewsSection from '@/components/ReviewsSection'
import RealStats from '@/components/RealStats'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Koubyte biedt professionele IT-diensten voor particulieren en bedrijven. Van hardware reparatie tot complete netwerkinstallaties. Snel, betrouwbaar en transparant.',
  openGraph: {
    title: 'Koubyte - Professionele IT-diensten',
    description: 'Betrouwbare IT-oplossingen voor particulieren en bedrijven',
    images: ['/og-image.jpg'],
  },
}

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden max-w-full w-full">
      {/* Hero Sectie - Professioneel en Subtiel */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Subtiele Achtergrond Elementen */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-slate-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-20 relative z-10 overflow-x-hidden w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Links - Tekst */}
            <div className="space-y-8 animate-fadeInUp">
              <div className="inline-block">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Professionele IT-diensten sinds 2020</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                Betrouwbare<br />
                <span className="text-blue-600">IT-oplossingen</span><br />
                voor jouw bedrijf
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                Van hardware reparatie tot complete netwerkinstallaties. 
                Ik help particulieren en kleine bedrijven met alle computerproblemen, 
                snel en vakkundig opgelost.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    Plan een afspraak
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                <Button size="lg" className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-6 text-lg font-semibold rounded-lg shadow-md transition-all duration-300">
                  Neem contact op
                </Button>
                </Link>
              </div>

              {/* ECHTE Statistieken uit Database */}
              <RealStats />
            </div>

            {/* Rechts - Info Cards */}
            <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Gegarandeerde kwaliteit</h3>
                    <p className="text-slate-600">Alle werkzaamheden worden professioneel uitgevoerd met garantie op het werk.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Snelle service</h3>
                    <p className="text-slate-600">Reactie binnen 24 uur. Voor urgente zaken zijn we vaak dezelfde dag beschikbaar.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Transparante prijzen</h3>
                    <p className="text-slate-600">Duidelijke prijsafspraken vooraf. Geen verborgen kosten of verrassingen achteraf.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diensten Overzicht */}
      <section className="py-24 px-3 sm:px-4 bg-white overflow-x-hidden w-full">
        <div className="container mx-auto max-w-7xl w-full overflow-x-hidden">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Wat we voor je kunnen betekenen
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Een compleet overzicht van alle IT-diensten die we aanbieden voor particulieren en bedrijven
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Hardware & Reparatie */}
            <div className="group bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Monitor className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Hardware & Reparatie</h3>
              <p className="text-slate-600 mb-4">
                Volledige diagnose en reparatie van computers, laptops en randapparatuur. Ook voor upgrades en uitbreidingen.
              </p>
              <Link href="/diensten" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center">
                Meer informatie <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Software & Systemen */}
            <div className="group bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Software & Systemen</h3>
              <p className="text-slate-600 mb-4">
                Installatie en configuratie van software, besturingssystemen en updates. Inclusief optimalisatie en probleemoplossing.
              </p>
              <Link href="/diensten" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center">
                Meer informatie <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Netwerk & Beveiliging */}
            <div className="group bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wifi className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Netwerk & Wifi</h3>
              <p className="text-slate-600 mb-4">
                Complete netwerkinstallaties, wifi-optimalisatie en router configuratie. Voor thuis en op kantoor.
              </p>
              <Link href="/diensten" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center">
                Meer informatie <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Beveiliging */}
            <div className="group bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Beveiliging & Virussen</h3>
              <p className="text-slate-600 mb-4">
                Verwijdering van virussen en malware, installatie van beveiligingssoftware en preventief advies.
              </p>
              <Link href="/diensten" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center">
                Meer informatie <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Data & Backup */}
            <div className="group bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Database className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Data & Backup</h3>
              <p className="text-slate-600 mb-4">
                Dataherstel bij verlies, automatische backup oplossingen en veilige datamigratie tussen systemen.
              </p>
              <Link href="/diensten" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center">
                Meer informatie <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Onderhoud */}
            <div className="group bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wrench className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Onderhoud & Advies</h3>
              <p className="text-slate-600 mb-4">
                Preventief onderhoud, periodieke controles en professioneel advies over je IT-infrastructuur.
              </p>
              <Link href="/diensten" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center">
                Meer informatie <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Waarom Koubyte */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Links - Eerlijkheid */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-10 h-10 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-900">Echte Reviews</h3>
                </div>
                <p className="text-slate-600 mb-4">
                  Alle statistieken en reviews op deze website zijn 100% echt en komen direct uit onze database.
                </p>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Geverifieerde Klantervaringen</span>
                </div>
              </div>

              <div className="bg-blue-600 p-8 rounded-2xl text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Direct contact nodig?</h3>
                <p className="mb-6 text-blue-100">Bel of stuur gerust een berichtje voor een snelle oplossing van je probleem.</p>
                <a href="tel:+32484522662" className="text-2xl font-bold hover:text-blue-100 transition-colors">
                  +32 484 52 26 62
                </a>
              </div>
            </div>

            {/* Rechts - Waarom */}
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Waarom kiezen voor Koubyte?
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Al jaren de betrouwbare IT-partner voor particulieren en kleine bedrijven in de regio.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Persoonlijke aanpak",
                    description: "Je hebt direct contact met mij, geen callcenters of wachttijden. Persoonlijke service staat voorop."
                  },
                  {
                    title: "Ruime ervaring",
                    description: "Jarenlange ervaring met alle gangbare merken, systemen en software. Van Windows tot Mac, van HP tot Dell."
                  },
                  {
                    title: "Eerlijke prijzen",
                    description: "Duidelijke prijsafspraken vooraf. Je betaalt alleen voor de tijd en materialen die daadwerkelijk nodig zijn."
                  },
                  {
                    title: "Snelle respons",
                    description: "Meestal binnen 24 uur reactie en bij urgente zaken vaak nog dezelfde dag een oplossing."
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section - Echte klant reviews */}
      <ReviewsSection />

      {/* Laatste CTA */}
      <section className="py-24 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <HelpCircle className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Computerproblemen? Ik help je graag
          </h2>
          <p className="text-xl mb-10 text-blue-100">
            Neem contact op voor advies, een afspraak of een vrijblijvende offerte.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-6 text-lg font-semibold rounded-lg shadow-xl">
                Plan een afspraak
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-2 border-white px-10 py-6 text-lg font-semibold rounded-lg shadow-lg">
                Bekijk prijzen
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
