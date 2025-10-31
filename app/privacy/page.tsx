import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Privacybeleid',
  description: 'Privacybeleid van Koubyte - Hoe we omgaan met uw persoonsgegevens volgens de AVG/GDPR wetgeving.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">Privacybeleid</h1>
        <p className="text-slate-600 mb-8">Laatst bijgewerkt: Oktober 2024</p>

        <div className="prose prose-slate max-w-none space-y-8">
          {/* Introductie */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">1. Introductie</h2>
            <p className="text-slate-700 leading-relaxed">
              Koubyte respecteert de privacy van alle gebruikers van haar website en draagt er zorg voor dat de persoonlijke informatie die u ons verschaft vertrouwelijk wordt behandeld. Dit privacybeleid is opgesteld in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG/GDPR).
            </p>
          </section>

          {/* Wie zijn wij */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">2. Wie zijn wij?</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              <strong>Koubyte</strong> is een IT-dienstverlener gevestigd in België.
            </p>
            <div className="bg-slate-50 p-6 rounded-xl">
              <p className="text-slate-700"><strong>Contact:</strong></p>
              <p className="text-slate-700">Email: info@koubyte.be</p>
              <p className="text-slate-700">Telefoon: +32 484 52 26 62</p>
              <p className="text-slate-700">Website: https://koubyte.be</p>
            </div>
          </section>

          {/* Welke gegevens verzamelen we */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">3. Welke persoonsgegevens verzamelen we?</h2>
            <p className="text-slate-700 mb-4">We verzamelen alleen gegevens die u zelf verstrekt via:</p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Contactformulier:</h3>
                <ul className="list-disc list-inside text-slate-700 space-y-2">
                  <li>Naam</li>
                  <li>E-mailadres</li>
                  <li>Telefoonnummer (optioneel)</li>
                  <li>Bericht inhoud</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Afspraak maken:</h3>
                <ul className="list-disc list-inside text-slate-700 space-y-2">
                  <li>Naam</li>
                  <li>E-mailadres</li>
                  <li>Telefoonnummer</li>
                  <li>Gewenste datum en tijd</li>
                  <li>Beschrijving van het probleem</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Account registratie (optioneel):</h3>
                <ul className="list-disc list-inside text-slate-700 space-y-2">
                  <li>Naam</li>
                  <li>E-mailadres</li>
                  <li>Wachtwoord (versleuteld opgeslagen)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Waarvoor gebruiken we gegevens */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">4. Waarvoor gebruiken we uw gegevens?</h2>
            <p className="text-slate-700 mb-4">We gebruiken uw persoonsgegevens voor:</p>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Het beantwoorden van uw vragen en verzoeken</li>
              <li>Het plannen en uitvoeren van afspraken</li>
              <li>Het versturen van bevestigingen en herinneringen</li>
              <li>Het verbeteren van onze dienstverlening</li>
              <li>Het voldoen aan wettelijke verplichtingen</li>
            </ul>
          </section>

          {/* Rechtsgrond */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">5. Rechtsgrondslag</h2>
            <p className="text-slate-700 leading-relaxed">
              We verwerken uw persoonsgegevens op basis van:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mt-4">
              <li><strong>Toestemming:</strong> U geeft toestemming door het contactformulier in te vullen</li>
              <li><strong>Uitvoering overeenkomst:</strong> Voor het leveren van de afgesproken diensten</li>
              <li><strong>Gerechtvaardigd belang:</strong> Voor het verbeteren van onze dienstverlening</li>
              <li><strong>Wettelijke verplichting:</strong> Voor administratieve en fiscale doeleinden</li>
            </ul>
          </section>

          {/* Delen met derden */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">6. Delen we gegevens met derden?</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Koubyte verkoopt uw gegevens <strong>nooit</strong> aan derden. We delen alleen gegevens met:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li><strong>Email providers:</strong> Voor het versturen van bevestigingsmails</li>
              <li><strong>Hosting providers:</strong> Voor het hosten van onze website</li>
              <li><strong>Betalingsproviders:</strong> Voor het verwerken van betalingen</li>
            </ul>
            <p className="text-slate-700 mt-4">
              Al deze partijen zijn contractueel verplicht om uw gegevens vertrouwelijk te behandelen.
            </p>
          </section>

          {/* Bewaartermijn */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">7. Hoe lang bewaren we uw gegevens?</h2>
            <div className="space-y-3">
              <p className="text-slate-700"><strong>Contactformulieren:</strong> 1 jaar na laatste contact</p>
              <p className="text-slate-700"><strong>Afspraken en facturen:</strong> 7 jaar (wettelijke verplichting)</p>
              <p className="text-slate-700"><strong>Account gegevens:</strong> Tot u uw account verwijdert</p>
            </div>
          </section>

          {/* Beveiliging */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">8. Hoe beveiligen we uw gegevens?</h2>
            <p className="text-slate-700 mb-4">We nemen passende technische en organisatorische maatregelen:</p>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>HTTPS/SSL versleuteling voor alle communicatie</li>
              <li>Veilige opslag in moderne datacenters binnen de EU</li>
              <li>Wachtwoorden worden versleuteld opgeslagen</li>
              <li>Regelmatige security updates en back-ups</li>
              <li>Toegang tot gegevens is beperkt tot geautoriseerd personeel</li>
            </ul>
          </section>

          {/* Uw rechten */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">9. Uw rechten onder de AVG</h2>
            <p className="text-slate-700 mb-4">U heeft de volgende rechten:</p>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-slate-900">✓ Recht op inzage</h3>
                <p className="text-slate-700">U kunt opvragen welke gegevens we van u hebben</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-slate-900">✓ Recht op rectificatie</h3>
                <p className="text-slate-700">U kunt onjuiste gegevens laten corrigeren</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-slate-900">✓ Recht op verwijdering</h3>
                <p className="text-slate-700">U kunt uw gegevens laten verwijderen</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-slate-900">✓ Recht op beperking</h3>
                <p className="text-slate-700">U kunt de verwerking laten beperken</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-slate-900">✓ Recht op overdraagbaarheid</h3>
                <p className="text-slate-700">U kunt uw gegevens in een leesbaar formaat ontvangen</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-slate-900">✓ Recht van bezwaar</h3>
                <p className="text-slate-700">U kunt bezwaar maken tegen verwerking</p>
              </div>
            </div>
            <p className="text-slate-700 mt-4">
              Om deze rechten uit te oefenen, kunt u contact met ons opnemen via <a href="mailto:info@koubyte.be" className="text-blue-600 hover:text-blue-700 font-semibold">info@koubyte.be</a>
            </p>
          </section>

          {/* Cookies */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">10. Cookies</h2>
            <p className="text-slate-700 mb-4">
              Onze website gebruikt alleen essentiële cookies die noodzakelijk zijn voor de werking van de website:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li><strong>Sessie cookies:</strong> Voor inloggen en navigatie</li>
              <li><strong>Functionele cookies:</strong> Voor het onthouden van voorkeuren</li>
            </ul>
            <p className="text-slate-700 mt-4">
              We gebruiken geen tracking of marketing cookies zonder uw expliciete toestemming.
            </p>
          </section>

          {/* Klacht indienen */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">11. Klacht indienen</h2>
            <p className="text-slate-700 mb-4">
              Heeft u een klacht over hoe we met uw gegevens omgaan? Neem eerst contact met ons op via <a href="mailto:info@koubyte.be" className="text-blue-600 hover:text-blue-700 font-semibold">info@koubyte.be</a>
            </p>
            <p className="text-slate-700">
              U heeft ook het recht om een klacht in te dienen bij de Belgische privacytoezichthouder:
            </p>
            <div className="bg-slate-50 p-6 rounded-xl mt-4">
              <p className="text-slate-700 font-semibold">Gegevensbeschermingsautoriteit (GBA)</p>
              <p className="text-slate-700">Drukpersstraat 35, 1000 Brussel</p>
              <p className="text-slate-700">Tel: +32 2 274 48 00</p>
              <p className="text-slate-700">Website: <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">www.gegevensbeschermingsautoriteit.be</a></p>
            </div>
          </section>

          {/* Wijzigingen */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">12. Wijzigingen in dit privacybeleid</h2>
            <p className="text-slate-700 leading-relaxed">
              We kunnen dit privacybeleid van tijd tot tijd aanpassen. De meest recente versie is altijd te vinden op deze pagina. Belangrijke wijzigingen zullen we communiceren via onze website.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">13. Vragen?</h2>
            <p className="text-slate-700 mb-4">
              Heeft u vragen over dit privacybeleid of over hoe we met uw gegevens omgaan? Neem gerust contact met ons op:
            </p>
            <div className="space-y-2">
              <p className="text-slate-700"><strong>Email:</strong> <a href="mailto:info@koubyte.be" className="text-blue-600 hover:text-blue-700">info@koubyte.be</a></p>
              <p className="text-slate-700"><strong>Telefoon:</strong> <a href="tel:+32484522662" className="text-blue-600 hover:text-blue-700">+32 484 52 26 62</a></p>
            </div>
          </section>
        </div>

        {/* Terug link */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Terug naar home
          </Link>
        </div>
      </div>
    </div>
  )
}

