import { Card, CardContent } from '@/components/ui/card'

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
    answer: 'Prijzen variëren van €35-€60 per uur, afhankelijk van het type werk. Voor overzicht kun je de prijzenpagina bekijken, of vraag een offerte aan voor complexe projecten.',
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
    answer: '24/7 support is beschikbaar voor zakelijke klanten met een Premium of Zakelijk pakket. Voor particulieren ben ik beschikbaar tijdens normale kantoortijden.',
  },
]

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-4xl py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Veelgestelde vragen</h1>
        <p className="text-xl text-slate-600">
          Kunnen we je vraag niet beantwoorden? Neem gerust contact met me op.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
              <p className="text-slate-600">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-12 bg-blue-50">
        <CardContent className="pt-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Nog vragen?</h2>
          <p className="text-slate-600 mb-6">
            Neem gerust contact met me op via telefoon, WhatsApp of email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700">
                Neem contact op
              </button>
            </a>
            <a href="/book">
              <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-md hover:bg-blue-50">
                Boek een afspraak
              </button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

