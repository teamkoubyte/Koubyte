import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Veelgestelde Vragen - Koubyte',
  description: 'Antwoorden op veelgestelde vragen over Koubyte IT-diensten. Prijzen, beschikbaarheid, garantie, betaling en meer.',
  keywords: ['FAQ', 'veelgestelde vragen', 'IT-diensten', 'Koubyte', 'computer hulp België'],
  openGraph: {
    title: 'Veelgestelde Vragen - Koubyte',
    description: 'Alles wat je wil weten over Koubyte IT-diensten.',
    type: 'website',
  },
}

const faqs = [
  {
    question: 'Waarmee kan je me helpen?',
    answer: 'Ik help met alles wat met computers en netwerken te maken heeft: hardware reparatie, virus verwijderen, Windows herinstalleren, PC optimaliseren, wifi instellen, data overzetten, backups instellen en meer. Voor particulieren en kleine bedrijven.',
  },
  {
    question: 'Hoe snel kan je langskomen?',
    answer: 'Ik werk altijd op afspraak, 7 dagen per week — ook \'s avonds en in het weekend. Stuur een bericht of bel me en we plannen samen een moment dat voor jou past.',
  },
  {
    question: 'Wat kosten de diensten?',
    answer: 'Ik werk met vaste prijzen per dienst, zodat je nooit voor verrassingen staat. Een diagnose kost €45, virus verwijderen €75, Windows herinstalleren €90. Bekijk de volledige prijslijst op de diensten pagina.',
  },
  {
    question: 'Kom je bij mij thuis of op kantoor?',
    answer: 'Ja, ik kom altijd bij jou langs — thuis of op kantoor. Verplaatsing is gratis binnen 15 km. Daarna rekenen we €0,42 per km (het officiële Belgische tarief). Dit bespreken we altijd op voorhand.',
  },
  {
    question: 'Hoeveel kost de verplaatsing?',
    answer: 'Binnen een straal van 15 km is de verplaatsing gratis. Daarna €0,42 per km (officieel Belgisch tarief). Reistijd wordt niet aangerekend.',
  },
  {
    question: 'Welke garantie geef je?',
    answer: '3 maanden garantie op alle uitgevoerde herstellingen. Werkt iets niet zoals afgesproken? Dan kom ik kosteloos terug totdat het probleem volledig opgelost is.',
  },
  {
    question: 'Hoe betaal ik?',
    answer: 'Je betaalt na afloop van de werkzaamheden — contant, via overschrijving of met Payconiq. Bedrijven ontvangen een factuur met 15 dagen betalingstermijn. Je betaalt pas als je tevreden bent.',
  },
  {
    question: 'Reken je BTW aan?',
    answer: 'Nee. Koubyte valt onder de Belgische kleine ondernemersregeling. Zolang het jaarlijkse omzetplafond van €25.000 niet overschreden wordt, wordt er geen BTW aangerekend. De prijs die je ziet is de prijs die je betaalt.',
  },
  {
    question: 'Kan je ook Mac en Linux repareren?',
    answer: 'Ja. Ik heb ervaring met Windows, macOS en Linux. Ook voor softwareproblemen op smartphones en tablets kan ik je helpen.',
  },
  {
    question: 'Wat als mijn probleem niet opgelost is?',
    answer: 'Als iets niet werkt zoals we hadden afgesproken, kom ik kosteloos terug. Tevredenheid staat voorop — je betaalt pas als je blij bent met het resultaat.',
  },
  {
    question: 'Moet ik een account aanmaken?',
    answer: 'Nee. Je boekt een afspraak gewoon via het formulier, zonder account. Geen gedoe.',
  },
]

export default function FAQPage() {
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="flex flex-col overflow-x-hidden w-full">

        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-14 sm:py-20 px-4 sm:px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Veelgestelde vragen
            </h1>
            <p className="text-lg sm:text-xl text-slate-600">
              Staat jouw vraag er niet bij? Neem gerust contact op.
            </p>
          </div>
        </section>

        {/* FAQ list */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
          <div className="container mx-auto max-w-3xl">
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <Card key={index} className="border border-slate-200 hover:border-blue-200 transition-colors">
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="font-bold text-slate-900 mb-2">{faq.question}</h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 sm:mt-14 bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Nog een vraag?</h2>
              <p className="text-slate-600 mb-6 text-sm sm:text-base">
                Bel me, stuur een WhatsApp of maak direct een afspraak.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold">
                    Neem contact op
                  </Button>
                </Link>
                <Link href="/book" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 font-semibold">
                    Afspraak maken
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
