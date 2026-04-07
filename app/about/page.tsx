import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Shield, Clock, Wrench, Calendar, Phone } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Over mij - Koubyte IT',
  description: 'Leer meer over Koubyte — jouw persoonlijke IT-partner in België. Eerlijke hulp zonder gedoe, altijd op afspraak. Voor particulieren en kleine bedrijven.',
  keywords: ['over Koubyte', 'IT-partner België', 'computer hulp', 'zelfstandige IT', 'persoonlijke service'],
  openGraph: {
    title: 'Over mij - Koubyte IT',
    description: 'Eerlijke IT-hulp zonder gedoe, altijd op afspraak.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="flex flex-col overflow-x-hidden w-full">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-14 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Over mij</h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Ik ben Koubyte — jouw persoonlijke IT-partner die er is wanneer je computer weer eens gek doet.
          </p>
        </div>
      </section>

      {/* Verhaal */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-5">Hoe Koubyte is ontstaan</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Koubyte is ontstaan uit een simpele gedachte: iedereen verdient toegankelijke IT-hulp zonder gedoe.
                  Wat begon als het helpen van vrienden en familie met computerproblemen is uitgegroeid tot een
                  professionele dienst voor particulieren en kleine bedrijven in de regio.
                </p>
                <p>
                  Ik snap dat computers soms frustrerend kunnen zijn. Daarom leg ik alles uit in gewone mensentaal,
                  zonder ingewikkelde IT-termen waar niemand iets aan heeft. Na mijn bezoek begrijp je niet alleen
                  wat er mis was, maar ook hoe je het in de toekomst kunt voorkomen.
                </p>
                <p>
                  Of het nu gaat om je werkcomputer die vastloopt tijdens een belangrijke deadline, of een laptop
                  die ineens raar doet — ik help iedereen met evenveel geduld en enthousiasme. Want technologie
                  zou ons leven makkelijker moeten maken, niet moeilijker.
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6 pb-6">
                <h3 className="font-bold text-slate-900 mb-5 text-lg">Waarom mensen voor mij kiezen</h3>
                <ul className="space-y-3">
                  {[
                    'Ik ben er vaak dezelfde dag nog — want wie wil er nu wachten?',
                    'Geen technisch gebabbel — gewoon uitleg die je begrijpt',
                    'Je weet vooraf wat het kost, geen verrassingen achteraf',
                    'Ik neem de tijd, ook voor vragen die simpel lijken',
                    '3 maanden garantie op alle herstellingen',
                    'Betaling achteraf — je betaalt pas als je tevreden bent',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Waarden */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">Hoe ik werk</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                icon: Shield,
                title: 'Ik hou me aan mijn woord',
                body: 'Beloofd is beloofd. Als ik zeg dat ik er om 14u ben, dan ben ik er om 14u.',
              },
              {
                icon: Clock,
                title: 'Jij beslist, ik adviseer',
                body: 'Ik leg alle opties uit en de kosten, en jij beslist wat er gebeurt. Nooit druk.',
              },
              {
                icon: Wrench,
                title: 'Brede ervaring',
                body: 'Van Windows tot Mac, van oude desktop tot nieuwe laptop — ik heb het al vaker gezien.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <Card key={title} className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-600">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-blue-600 text-white">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Zullen we je probleem oplossen?</h2>
          <p className="text-blue-100 mb-8">
            Of het nu je laptop is die niet meer opstart of je netwerk dat het laat afweten —
            neem gerust contact op. Ik sta voor je klaar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book">
              <Button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-5">
                <Calendar className="w-5 h-5 mr-2" />
                Afspraak maken
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-5">
                <Phone className="w-5 h-5 mr-2" />
                Neem contact op
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
