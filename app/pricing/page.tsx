import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Check, ArrowRight, FileText, ShoppingCart, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Prijzen',
  description: 'Transparante prijzen voor al onze IT-diensten. Vaste prijzen per dienst, geen verborgen kosten. Voor custom oplossingen kun je een offerte aanvragen.',
  keywords: ['IT-prijzen', 'computer reparatie kosten', 'IT-diensten tarief', 'transparante prijzen', 'offerte'],
  openGraph: {
    title: 'Prijzen - Koubyte',
    description: 'Transparante prijzen zonder verborgen kosten',
  },
}

export default function PricingPage() {
  const categories = [
    {
      name: 'Hardware',
      icon: '🔧',
      description: 'Reparaties, upgrades en reiniging',
      priceRange: '€45 - €150',
      examples: ['Computer diagnose', 'SSD upgrade', 'RAM uitbreiding', 'Scherm vervanging'],
    },
    {
      name: 'Software',
      icon: '💻',
      description: 'Installatie en configuratie',
      priceRange: '€40 - €85',
      examples: ['Windows installatie', 'Office 365 setup', 'Software pakket', 'Drivers installeren'],
    },
    {
      name: 'Beveiliging',
      icon: '🔒',
      description: 'Bescherming tegen virussen en malware',
      priceRange: '€65 - €90',
      examples: ['Virus verwijdering', 'Firewall setup', 'Ransomware bescherming', 'Security audit'],
    },
    {
      name: 'Netwerk',
      icon: '📡',
      description: 'WiFi en netwerkoplossingen',
      priceRange: '€35 - €135',
      examples: ['WiFi installatie', 'Router setup', 'Printer koppelen', 'Thuisnetwerk'],
    },
    {
      name: 'Onderhoud',
      icon: '⚙️',
      description: 'Optimalisatie en preventief onderhoud',
      priceRange: '€30 - €70',
      examples: ['Systeem cleanup', 'Backup instellen', 'Updates', 'Performance tuning'],
    },
    {
      name: 'Data',
      icon: '💾',
      description: 'Dataherstel en migratie',
      priceRange: '€65 - €300',
      examples: ['Data recovery', 'Bestanden herstellen', 'Data overdracht', 'Backup restore'],
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-24 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 animate-fadeInDown">
            Transparante Prijzen
          </h1>
          <p className="text-xl text-slate-600 mb-4 animate-fadeInUp">
            Vaste prijzen per dienst. Geen verrassingen, geen verborgen kosten.
          </p>
          <p className="text-lg text-slate-500 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Bekijk onze diensten of vraag een offerte aan voor custom oplossingen.
          </p>
        </div>
      </section>

      {/* Main Options */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Individuele Diensten */}
            <Card className="border-2 border-blue-500 shadow-2xl hover:shadow-3xl transition-all">
              <CardHeader className="bg-blue-50">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-center">Individuele Diensten</CardTitle>
                <CardDescription className="text-center text-lg">
                  Kies precies wat je nodig hebt
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-slate-700">Vaste prijzen per dienst (€30 - €300)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-slate-700">20+ verschillende IT-diensten</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-slate-700">Direct bestellen via winkelwagentje</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-slate-700">Duidelijke omschrijving per dienst</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-slate-700">Geschatte uitvoeringstijd</span>
                  </li>
                </ul>
                <Link href="/diensten">
                  <Button className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                    Bekijk alle diensten
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Custom Offerte */}
            <Card className="border-2 border-purple-500 shadow-2xl hover:shadow-3xl transition-all">
              <CardHeader className="bg-purple-50">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-center">Offerte op Maat</CardTitle>
                <CardDescription className="text-center text-lg">
                  Voor grotere projecten of pakketten
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-slate-700">Meerdere diensten gecombineerd</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-slate-700">Custom IT-oplossingen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-slate-700">Zakelijke pakketten</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-slate-700">Onderhoudcontracten</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-slate-700">Gratis adviesgesprek</span>
                  </li>
                </ul>
                <Link href="/contact">
                  <Button className="w-full py-6 text-lg font-semibold bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all">
                    Vraag offerte aan
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Onze Dienst Categorieën</h2>
            <p className="text-xl text-slate-600">
              Bekijk het prijsoverzicht per categorie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card key={category.name} className="border-2 hover:border-blue-500 hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="text-5xl mb-3 text-center">{category.icon}</div>
                  <CardTitle className="text-2xl text-center">{category.name}</CardTitle>
                  <CardDescription className="text-center">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-blue-600">{category.priceRange}</span>
                  </div>
                  <ul className="space-y-2">
                    {category.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/diensten">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl">
                Bekijk alle diensten met prijzen
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Veelgestelde Vragen</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Zijn dit de exacte prijzen?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  Ja! Alle prijzen op de diensten pagina zijn vaste prijzen per dienst. 
                  Wat je ziet is wat je betaalt, geen verborgen kosten.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Wanneer heb ik een offerte nodig?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  Een offerte is handig als je meerdere diensten wilt combineren, een zakelijk pakket zoekt, 
                  of een custom oplossing nodig hebt die niet in onze standaard diensten past.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Hoe werkt het bestellen?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  Heel simpel: kies je diensten, voeg toe aan winkelwagentje, plaats je bestelling. 
                  We nemen dan contact met je op om een afspraak in te plannen. Betaling gebeurt na afloop.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Wat als mijn probleem niet in de lijst staat?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  Geen probleem! Neem contact met ons op en beschrijf je situatie. 
                  We maken dan een passende offerte voor je op maat.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Hulp nodig bij je keuze?</h2>
          <p className="text-xl mb-8 text-blue-100">
            We helpen je graag met advies over welke diensten je nodig hebt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+32484522662">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-xl">
                <Phone className="w-5 h-5 mr-2" />
                Bel: +32 484 52 26 62
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" className="bg-white border-2 border-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-xl">
                <Mail className="w-5 h-5 mr-2" />
                Stuur bericht
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
