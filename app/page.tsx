import { Button } from '@/components/ui/button'
import { Wrench, Shield, Zap, Database, Wifi, Monitor, Lock, ArrowRight, CheckCircle, Phone, Calendar } from 'lucide-react'
import Link from 'next/link'
import ReviewsSection from '@/components/ReviewsSection'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Koubyte biedt professionele IT-diensten voor particulieren en bedrijven in België. Van hardware reparatie tot netwerkinstallaties. Op afspraak, eerlijke prijzen.',
  openGraph: {
    title: 'Koubyte - Professionele IT-diensten',
    description: 'Betrouwbare IT-hulp voor particulieren en kleine bedrijven. Altijd op afspraak.',
  },
}

const dienstCards = [
  { icon: Monitor, title: 'Hardware & Reparatie', desc: 'Diagnose, reparatie en upgrades van computers en laptops.' },
  { icon: Zap,     title: 'Software & Systemen',  desc: 'Windows herinstalleren, optimaliseren en programma\'s instellen.' },
  { icon: Wifi,    title: 'Netwerk & WiFi',        desc: 'Router instellen, wifi verbeteren en netwerk installeren.' },
  { icon: Lock,    title: 'Beveiliging & Virussen',desc: 'Virussen verwijderen en je toestel goed beveiligen.' },
  { icon: Database,title: 'Data & Backup',         desc: 'Data overzetten, backups instellen en bestanden herstellen.' },
  { icon: Wrench,  title: 'Onderhoud & Advies',    desc: 'Jaarlijkse onderhoudsbeurt en eerlijk IT-advies.' },
]

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden max-w-full w-full">

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-slate-400/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Tekst */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>IT-hulp voor particulieren & kleine bedrijven</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Computerproblemen?<br />
                <span className="text-blue-600">Ik los het op.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Eerlijke prijzen, duidelijke uitleg en altijd op afspraak.
                Geen callcenter — je belt rechtstreeks met mij.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/book" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 text-base font-semibold rounded-lg shadow-lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Afspraak maken
                  </Button>
                </Link>
                <Link href="/diensten" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-5 text-base font-semibold rounded-lg shadow-md">
                    Bekijk prijzen
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-5 pt-2 text-sm text-slate-600">
                {['3 maanden garantie', 'Altijd op afspraak', 'Geen BTW (kleine onderneming)'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info cards */}
            <div className="space-y-4">
              {[
                { icon: Shield, title: 'Gegarandeerde kwaliteit',  body: '3 maanden garantie op alle herstellingen. Werkt het niet? Dan kom ik kosteloos terug.' },
                { icon: Zap,    title: 'Snel geholpen',            body: 'Reactie binnen 24 uur. Urgente problemen worden dezelfde dag opgepakt waar mogelijk.' },
                { icon: Phone,  title: 'Direct contact',           body: 'Je belt rechtstreeks met mij. Geen wachtrij, geen doorverwijzingen.' },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-200 flex items-start gap-4">
                  <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                    <p className="text-sm text-slate-600">{body}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Diensten overzicht */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Wat kan ik voor je doen?
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Van een trage laptop tot een volledig kantoornetwerk — ik help met alle IT-problemen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {dienstCards.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 mb-4">{desc}</p>
                <Link href="/diensten" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center text-sm">
                  Prijzen bekijken <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waarom Koubyte */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <div className="space-y-5">
              <div className="bg-blue-600 p-6 sm:p-8 rounded-2xl text-white shadow-xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Direct contact nodig?</h3>
                <p className="mb-5 text-blue-100 text-sm sm:text-base">Bel of app me voor een snelle oplossing. Je spreekt altijd met mij persoonlijk.</p>
                <a href="tel:+32484522662" className="text-2xl font-bold hover:text-blue-100 transition-colors block">
                  +32 484 52 26 62
                </a>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Hoe werkt het?</h3>
                <ol className="space-y-3">
                  {[
                    'Maak een afspraak online of via telefoon',
                    'Ik kom bij je thuis of op kantoor',
                    'Probleem opgelost, uitleg inbegrepen',
                    'Betalen na afloop — geen verrassingen',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-5">
                Waarom kiezen voor Koubyte?
              </h2>
              <div className="space-y-5">
                {[
                  { title: 'Persoonlijke aanpak',  desc: 'Je hebt direct contact met mij, geen callcenters of wachtrijen. Persoonlijke service staat voorop.' },
                  { title: 'Duidelijke uitleg',    desc: 'Geen technisch jargon. Ik leg uit wat er mis was en hoe je het kunt voorkomen.' },
                  { title: 'Eerlijke prijzen',     desc: 'Vaste prijzen, vooraf afgesproken. Je betaalt alleen wat we hadden afgesproken.' },
                  { title: 'Garantie op mijn werk',desc: '3 maanden garantie op alle herstellingen. Als het terugkomt, kom ik kosteloos terug.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-0.5">{title}</h4>
                      <p className="text-sm text-slate-600">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSection />

      {/* CTA */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-blue-600">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Klaar om je probleem op te lossen?
          </h2>
          <p className="text-base sm:text-lg mb-8 text-blue-100">
            Maak een afspraak of neem contact op. Ik help je graag verder.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 px-8 py-5 text-base font-semibold rounded-lg shadow-xl">
                <Calendar className="w-5 h-5 mr-2" />
                Afspraak maken
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 px-8 py-5 text-base font-semibold rounded-lg">
                Stuur een bericht
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
