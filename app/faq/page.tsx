import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'
import Script from 'next/script'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Veelgestelde Vragen - Koubyte FAQ',
  description: 'Antwoorden op veelgestelde vragen over Koubyte IT-diensten. Prijzen, diensten, afspraak maken, support en meer. Alles wat je moet weten over onze IT-hulp.',
  keywords: ['FAQ', 'veelgestelde vragen', 'IT-diensten vragen', 'Koubyte support', 'computer hulp België', 'IT-prijzen'],
  openGraph: {
    title: 'Veelgestelde Vragen - Koubyte',
    description: 'Vind antwoorden op je vragen over Koubyte IT-diensten',
    type: 'website',
  },
}

const faqs = [
  {
    question: 'Wat voor diensten lever je?',
    answer: 'Ik help met alle IT-problemen: hardware reparatie, software installatie, netwerk configuratie, virus- en malware verwijdering, dataherstel, systeemonderhoud, upgrades en meer. Voor particulieren en kleine bedrijven.',
  },
  {
    question: 'Hoe snel kun je langskomen?',
    answer: 'Ik probeer altijd om zelfde dag te reageren op urgente problemen. Voor planbare werkzaamheden stemmen we samen een geschikt moment af, meestal binnen 1-3 werkdagen.',
  },
  {
    question: 'Wat kosten de verschillende diensten?',
    answer: 'Prijzen variëren van €35-€60 per uur, afhankelijk van het type werk. Vraag een offerte aan voor complexe projecten.',
  },
  {
    question: 'Moet ik een account aanmaken om een afspraak te boeken?',
    answer: 'Nee, je kunt direct een afspraak boeken zonder account. Een account maakt het wel makkelijker om je afspraken te beheren en je geschiedenis te zien.',
  },
  {
    question: 'Kun je ook op locatie komen?',
    answer: 'Ja! Ik kom bij je thuis of op kantoor langs. Reiskosten zijn exclusief en afhankelijk van de afstand. Dit bespreken we altijd vooraf.',
  },
  {
    question: 'Wat als ik tevreden ben met de service?',
    answer: 'Dan zou ik het fijn vinden als je een review achterlaat! Je kunt je ervaring delen op de website. Feedback is belangrijk en helpt anderen.',
  },
  {
    question: 'Bereik jij ook mijn bedrijf?',
    answer: 'Ik richt me op particulieren en kleine bedrijven (1-25 werknemers). Als je een groter bedrijf bent, kan ik je doorverwijzen naar een geschikte partner.',
  },
  {
    question: 'Kun je ook Mac en Linux computers repareren?',
    answer: 'Ja! Ik heb ervaring met Windows, macOS en Linux. Ook voor Apple devices en smartphones kan ik je helpen met softwareproblemen.',
  },
  {
    question: 'Wat als mijn probleem niet is opgelost?',
    answer: 'Mocht iets niet goed werken zoals we hadden afgesproken, dan ga ik kosteloos verder met het probleem totdat alles werkt. Tevredenheid staat voorop.',
  },
  {
    question: 'Bied je ook 24/7 support?',
    answer: 'Ik werk altijd op afspraak, 7 dagen per week. Stuur een bericht of bel me en we plannen samen een moment dat past — ook \'s avonds of in het weekend.',
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

      <div className="container mx-auto max-w-4xl py-10 sm:py-14 lg:py-16 px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Veelgestelde vragen</h1>
          <p className="text-base sm:text-xl text-slate-600">
            Kunnen we je vraag niet beantwoorden? Neem gerust contact met me op.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-4 sm:pt-6 sm:px-6 sm:pb-6">
                <h3 className="font-semibold text-base sm:text-lg mb-2">{faq.question}</h3>
                <p className="text-sm sm:text-base text-slate-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 sm:mt-12 bg-blue-50">
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Nog vragen?</h2>
            <p className="text-sm sm:text-base text-slate-600 mb-5 sm:mb-6">
              Neem gerust contact met me op via telefoon, WhatsApp of email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Neem contact op
                </Button>
              </Link>
              <Link href="/book" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                  Boek een afspraak
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
