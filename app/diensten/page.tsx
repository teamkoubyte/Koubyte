import { Button } from '@/components/ui/button'
import { Check, Clock, Calendar, Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diensten & Prijzen - Koubyte IT',
  description: 'Duidelijke prijzen voor alle IT-diensten. Hardware reparatie, virus verwijderen, netwerk, dataherstel en meer. Geen verrassingen, eerlijke tarieven.',
  keywords: ['IT-diensten prijzen', 'computer reparatie prijs', 'laptop reparatie', 'virus verwijderen', 'netwerk installatie', 'dataherstel België'],
}

const services = [
  {
    category: 'Hardware & Reparatie',
    color: '',
    items: [
      {
        name: 'Diagnose & Advies',
        price: 45,
        unit: 'eenmalig',
        time: '30–60 min',
        popular: false,
        note: 'Gratis bij uitvoering van de reparatie',
        features: [
          'Volledige diagnose van het probleem',
          'Duidelijke uitleg in gewone taal',
          'Prijsopgave voor de reparatie',
          'Eerlijk advies — ook als je niks nodig hebt',
        ],
      },
      {
        name: 'PC of laptop reinigen',
        price: 55,
        unit: 'vaste prijs',
        time: '1–2 uur',
        popular: false,
        note: null,
        features: [
          'Stof verwijderen uit koeling en ventilator',
          'Thermische pasta vernieuwen',
          'Oververhitting tegengaan',
          'Stiller en koeler toestel als resultaat',
        ],
      },
      {
        name: 'RAM uitbreiden',
        price: 40,
        unit: 'arbeid',
        time: '30–60 min',
        popular: false,
        note: 'Materialen (RAM-geheugen) apart verrekend',
        features: [
          'Juiste RAM opzoeken voor jouw toestel',
          'Installatie en test',
          'Snellere werking zeker bij multitasking',
        ],
      },
      {
        name: 'SSD of HDD vervangen',
        price: 55,
        unit: 'arbeid',
        time: '1–2 uur',
        popular: true,
        note: 'Materialen (SSD/HDD) apart verrekend',
        features: [
          'Oude schijf klonen naar nieuwe',
          'Geen dataverlies bij migratie',
          'Drastisch snellere opstarttijd met SSD',
          'Windows of macOS blijft intact',
        ],
      },
    ],
  },
  {
    category: 'Software & Systemen',
    color: '',
    items: [
      {
        name: 'Virus & malware verwijderen',
        price: 75,
        unit: 'vaste prijs',
        time: '1–3 uur',
        popular: true,
        note: null,
        features: [
          'Grondige scan en verwijdering',
          'Beveiligingssoftware installeren',
          'Tips om herinfectie te vermijden',
          '3 maanden garantie',
        ],
      },
      {
        name: 'Windows herinstalleren',
        price: 90,
        unit: 'vaste prijs',
        time: '2–4 uur',
        popular: false,
        note: 'Data wordt vooraf veiliggesteld',
        features: [
          'Schone installatie van Windows',
          'Alle drivers installeren',
          'Updates doorvoeren',
          'Persoonlijke bestanden terugzetten',
        ],
      },
      {
        name: 'PC optimaliseren & versnellen',
        price: 65,
        unit: 'vaste prijs',
        time: '1–2 uur',
        popular: false,
        note: null,
        features: [
          'Onnodige programma\'s verwijderen',
          'Opstart versnellen',
          'Windows tunen voor betere prestaties',
          'Schijf opruimen en defragmenteren',
        ],
      },
      {
        name: 'Software installeren & instellen',
        price: 50,
        unit: 'vaste prijs',
        time: '30–90 min',
        popular: false,
        note: null,
        features: [
          'Installatie van programma\'s naar keuze',
          'Office, Adobe, antivirus, ...',
          'Configuratie op maat',
          'Uitleg over gebruik',
        ],
      },
    ],
  },
  {
    category: 'Netwerk & WiFi',
    color: '',
    items: [
      {
        name: 'WiFi instellen & optimaliseren',
        price: 70,
        unit: 'vaste prijs',
        time: '1–2 uur',
        popular: false,
        note: null,
        features: [
          'Router correct instellen',
          'Kanaal en frequentie optimaliseren',
          'Dode zones identificeren',
          'Advies over bereikverbetering',
        ],
      },
      {
        name: 'Netwerk installatie',
        price: 120,
        unit: 'vanaf',
        time: '2–4 uur',
        popular: false,
        note: 'Prijs afhankelijk van situatie — offerte op maat',
        features: [
          'Volledig netwerk thuis of klein kantoor',
          'Bekabeld en/of draadloos',
          'Veilige configuratie',
          'Meerdere toestellen verbinden',
        ],
      },
    ],
  },
  {
    category: 'Data & Backup',
    color: '',
    items: [
      {
        name: 'Data overzetten',
        price: 65,
        unit: 'vaste prijs',
        time: '1–3 uur',
        popular: false,
        note: null,
        features: [
          'Bestanden, foto\'s, documenten overzetten',
          'Van oude naar nieuwe PC of laptop',
          'Ook van Windows naar Mac (of omgekeerd)',
          'Alles gecontroleerd na overdracht',
        ],
      },
      {
        name: 'Backup oplossing instellen',
        price: 60,
        unit: 'vaste prijs',
        time: '1–2 uur',
        popular: false,
        note: null,
        features: [
          'Automatische backups instellen',
          'Lokaal (externe schijf) of cloud',
          'Nooit meer bestanden verliezen',
          'Uitleg over hoe het werkt',
        ],
      },
      {
        name: 'Dataherstel',
        price: 95,
        unit: 'vanaf',
        time: 'variabel',
        popular: false,
        note: 'Complexe gevallen op offerte — geen data = geen rekening',
        features: [
          'Verwijderde bestanden herstellen',
          'Herstellen na crash of formattering',
          'Foto\'s, documenten, video\'s',
          'Je betaalt alleen als het lukt',
        ],
      },
    ],
  },
  {
    category: 'Onderhoud & Advies',
    color: '',
    items: [
      {
        name: 'Jaarlijkse onderhoudsbeurt',
        price: 75,
        unit: 'vaste prijs',
        time: '1–2 uur',
        popular: false,
        note: null,
        features: [
          'Fysieke reiniging',
          'Systeem controleren en optimaliseren',
          'Updates doorvoeren',
          'Preventieve problemen opsporen',
        ],
      },
      {
        name: 'Remote hulp (per uur)',
        price: 55,
        unit: 'per uur',
        time: 'op afstand',
        popular: false,
        note: 'Minimaal 30 min — afgerond per kwartier',
        features: [
          'Hulp op afstand via TeamViewer',
          'Geen verplaatsingskost',
          'Snel geholpen voor kleine problemen',
          'Beschikbaar op afspraak',
        ],
      },
    ],
  },
]


export default function DienstenPage() {
  return (
    <div className="flex flex-col overflow-x-hidden w-full">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-14 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Diensten & Prijzen
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-6 max-w-2xl mx-auto">
            Duidelijke, eerlijke prijzen. Je weet op voorhand wat het kost — geen verrassingen achteraf.
          </p>
          <Link href="/book">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 text-base font-semibold rounded-lg shadow-lg">
              <Calendar className="w-5 h-5 mr-2" />
              Afspraak maken
            </Button>
          </Link>
        </div>
      </section>

      {/* BTW info banner */}
      <div className="bg-blue-600 text-white py-3 px-4 text-center text-sm">
        <strong>Transparante prijzen:</strong> Koubyte valt onder de Belgische kleine ondernemersregeling — geen BTW aangerekend zolang het jaarlijkse omzetplafond van €25.000 niet overschreden wordt.
      </div>

      {/* Services by category */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-6xl space-y-16">
          {services.map((group) => (
            <div key={group.category}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-slate-900 pb-3 border-b-2 border-blue-200">
                {group.category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {group.items.map((service) => (
                  <div
                    key={service.name}
                    className={`relative rounded-2xl border-2 p-5 sm:p-6 flex flex-col bg-white hover:shadow-xl transition-shadow ${
                      service.popular ? 'border-blue-500 shadow-lg' : 'border-slate-200'
                    }`}
                  >
                    {service.popular && (
                      <div className="absolute -top-3 left-5 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Populair
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{service.name}</h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 my-3">
                        <span className="text-3xl font-extrabold text-blue-600">€{service.price}</span>
                        <span className="text-sm text-slate-500">{service.unit}</span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{service.time}</span>
                      </div>

                      {/* Note */}
                      {service.note && (
                        <p className="text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg mb-3">
                          ℹ️ {service.note}
                        </p>
                      )}

                      {/* Features */}
                      <ul className="space-y-1.5 mb-4">
                        {service.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link href="/book" className="mt-auto">
                      <Button className="w-full font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                        <Calendar className="w-4 h-4 mr-2" />
                        Afspraak maken
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verplaatsingskost info */}
      <section className="py-10 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Wat je ook moet weten</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: 'Verplaatsing',
                body: 'Binnen een straal van 15 km: gratis. Daarna €0,42/km (officieel Belgisch tarief). Reistijd wordt niet aangerekend.',
              },
              {
                title: 'Betaling',
                body: 'Na afloop betaal je contant, via overschrijving of Payconiq. Bedrijven ontvangen een factuur met 15 dagen betalingstermijn.',
              },
              {
                title: 'Garantie',
                body: '3 maanden garantie op alle uitgevoerde herstellingen. Werkt het niet zoals afgesproken? Dan kom ik kosteloos terug.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-blue-600 text-white text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Niet zeker wat je nodig hebt?</h2>
          <p className="text-blue-100 mb-8 text-base sm:text-lg">
            Neem gewoon contact op. We kijken samen wat de beste oplossing is — zonder verplichtingen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+32484522662">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-5">
                <Phone className="w-5 h-5 mr-2" />
                +32 484 52 26 62
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-5">
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
