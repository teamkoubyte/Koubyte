import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Algemene Voorwaarden',
  description: 'Algemene voorwaarden van Koubyte - De voorwaarden voor gebruik van onze diensten.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">Algemene Voorwaarden</h1>
        <p className="text-slate-600 mb-8">Laatst bijgewerkt: Oktober 2024</p>

        <div className="prose prose-slate max-w-none space-y-8">
          {/* Artikel 1 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 1: Definities</h2>
            <div className="space-y-3 text-slate-700">
              <p><strong>Koubyte:</strong> IT-dienstverlener gevestigd in België</p>
              <p><strong>Klant:</strong> Iedere natuurlijke of rechtspersoon die gebruik maakt van de diensten van Koubyte</p>
              <p><strong>Diensten:</strong> Alle IT-diensten die Koubyte aanbiedt, waaronder maar niet beperkt tot hardware reparatie, software installatie, netwerkbeheer en IT-support</p>
              <p><strong>Overeenkomst:</strong> De tussen Koubyte en de klant gesloten overeenkomst voor het verlenen van diensten</p>
            </div>
          </section>

          {/* Artikel 2 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 2: Toepasselijkheid</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes en overeenkomsten tussen Koubyte en de klant.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Afwijkingen van deze voorwaarden zijn alleen geldig indien deze schriftelijk zijn overeengekomen. Deze algemene voorwaarden prevaleren boven eventuele voorwaarden van de klant.
            </p>
          </section>

          {/* Artikel 3 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 3: Aanbiedingen en Offertes</h2>
            <ul className="list-decimal list-inside text-slate-700 space-y-2">
              <li>Alle aanbiedingen en offertes zijn vrijblijvend, tenzij anders vermeld</li>
              <li>Een offerte is geldig gedurende 30 dagen, tenzij anders aangegeven</li>
              <li>Prijzen in offertes zijn exclusief BTW, tenzij anders vermeld</li>
              <li>Koubyte kan niet aan een offerte gebonden worden indien duidelijk is dat de offerte een kennelijke vergissing bevat</li>
            </ul>
          </section>

          {/* Artikel 4 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 4: Totstandkoming Overeenkomst</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Een overeenkomst komt tot stand:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Bij mondelinge of schriftelijke acceptatie van de offerte door de klant</li>
              <li>Bij opdrachtverlening via telefoon, email of online systeem</li>
              <li>Bij aanvang van werkzaamheden na overleg met de klant</li>
            </ul>
          </section>

          {/* Artikel 5 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 5: Uitvoering Diensten</h2>
            <div className="space-y-4 text-slate-700">
              <p><strong>5.1</strong> Koubyte zal de overeengekomen diensten naar beste kunnen en vakmanschap uitvoeren.</p>
              <p><strong>5.2</strong> Koubyte bepaalt de wijze waarop de diensten worden uitgevoerd en welke personen hiervoor worden ingezet.</p>
              <p><strong>5.3</strong> De klant zorgt ervoor dat alle gegevens en middelen die nodig zijn voor de uitvoering tijdig beschikbaar zijn.</p>
              <p><strong>5.4</strong> Levertijden zijn indicatief en gelden niet als fatale termijn, tenzij uitdrukkelijk anders is overeengekomen.</p>
            </div>
          </section>

          {/* Artikel 6 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 6: Prijzen en Betaling</h2>
            <div className="space-y-4 text-slate-700">
              <p><strong>6.1</strong> Alle genoemde prijzen zijn in euro&apos;s en exclusief BTW, tenzij anders vermeld.</p>
              <p><strong>6.2</strong> Voor werkzaamheden op basis van nacalculatie geldt het overeengekomen uurtarief.</p>
              <p><strong>6.3</strong> Reiskosten kunnen apart in rekening worden gebracht.</p>
              <p><strong>6.4</strong> Betaling dient te geschieden binnen 14 dagen na factuurdatum, tenzij anders overeengekomen.</p>
              <p><strong>6.5</strong> Bij te late betaling is de klant van rechtswege in verzuim en is Koubyte gerechtigd de wettelijke rente en incassokosten in rekening te brengen.</p>
              <p><strong>6.6</strong> Bezwaren tegen facturen dienen binnen 14 dagen na factuurdatum schriftelijk te worden gemeld.</p>
            </div>
          </section>

          {/* Artikel 7 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 7: Annulering en Opzegging</h2>
            <div className="space-y-4 text-slate-700">
              <p><strong>7.1</strong> De klant kan een geplande afspraak tot 24 uur van tevoren kosteloos annuleren.</p>
              <p><strong>7.2</strong> Bij annulering binnen 24 uur voor de afspraak behoudt Koubyte zich het recht voor 50% van de overeengekomen prijs in rekening te brengen.</p>
              <p><strong>7.3</strong> Bij annulering tijdens of na aanvang van de werkzaamheden is het volledige bedrag verschuldigd voor de reeds verrichte werkzaamheden.</p>
              <p><strong>7.4</strong> Doorlopende onderhoudscontracten kunnen door beide partijen worden opgezegd met inachtneming van een opzegtermijn van 1 maand.</p>
            </div>
          </section>

          {/* Artikel 8 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 8: Garantie</h2>
            <div className="space-y-4 text-slate-700">
              <p><strong>8.1</strong> Koubyte garandeert dat alle werkzaamheden vakkundig en zorgvuldig worden uitgevoerd.</p>
              <p><strong>8.2</strong> Op uitgevoerde reparaties geldt een garantietermijn van 3 maanden, tenzij anders overeengekomen.</p>
              <p><strong>8.3</strong> Op geleverde hardware geldt de fabrieksgarantie.</p>
              <p><strong>8.4</strong> De garantie vervalt indien:</p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li>De klant of derden zonder toestemming wijzigingen hebben aangebracht</li>
                <li>Het defect het gevolg is van onoordeelkundig gebruik of nalatigheid</li>
                <li>Sprake is van normale slijtage</li>
              </ul>
            </div>
          </section>

          {/* Artikel 9 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 9: Aansprakelijkheid</h2>
            <div className="space-y-4 text-slate-700">
              <p><strong>9.1</strong> Koubyte is alleen aansprakelijk voor directe schade die het gevolg is van een toerekenbare tekortkoming.</p>
              <p><strong>9.2</strong> De aansprakelijkheid is beperkt tot het factuurbedrag van de betreffende opdracht, met een maximum van €2.500.</p>
              <p><strong>9.3</strong> Koubyte is niet aansprakelijk voor:</p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li>Indirecte schade, waaronder gevolgschade, gederfde winst, gemiste besparingen en schade door bedrijfsstagnatie</li>
                <li>Verlies van gegevens of beschadiging van gegevens</li>
                <li>Schade ontstaan door handelen van de klant of derden</li>
              </ul>
              <p><strong>9.4</strong> De klant is verantwoordelijk voor het maken van back-ups voordat werkzaamheden plaatsvinden.</p>
              <p><strong>9.5</strong> Aansprakelijkheidsclaims vervallen na verloop van 12 maanden na het moment waarop de schade is ontstaan.</p>
            </div>
          </section>

          {/* Artikel 10 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 10: Overmacht</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Koubyte is niet gehouden tot het nakomen van enige verplichting indien zij daartoe verhinderd wordt door een omstandigheid die niet is te wijten aan schuld, en noch krachtens de wet, rechtshandeling of in het verkeer geldende opvattingen voor haar rekening komt.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Onder overmacht wordt verstaan: ziekte, stakingen, brand, natuurrampen, pandemieën en alle andere situaties buiten de invloedssfeer van Koubyte.
            </p>
          </section>

          {/* Artikel 11 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 11: Intellectueel Eigendom</h2>
            <p className="text-slate-700 leading-relaxed">
              Alle rechten van intellectuele eigendom op door Koubyte ontwikkelde of ter beschikking gestelde materialen berusten uitsluitend bij Koubyte. Het is de klant niet toegestaan deze materialen te vermenigvuldigen of openbaar te maken zonder voorafgaande schriftelijke toestemming.
            </p>
          </section>

          {/* Artikel 12 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 12: Geheimhouding en Privacy</h2>
            <div className="space-y-4 text-slate-700">
              <p><strong>12.1</strong> Koubyte verplicht zich tot geheimhouding van alle vertrouwelijke informatie die zij in het kader van de opdracht ontvangt.</p>
              <p><strong>12.2</strong> Voor de verwerking van persoonsgegevens verwijzen we naar ons <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">Privacybeleid</Link>.</p>
              <p><strong>12.3</strong> Koubyte neemt passende technische en organisatorische maatregelen om gegevens te beschermen.</p>
            </div>
          </section>

          {/* Artikel 13 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 13: Geschillen en Toepasselijk Recht</h2>
            <div className="space-y-4 text-slate-700">
              <p><strong>13.1</strong> Op alle overeenkomsten tussen Koubyte en de klant is Belgisch recht van toepassing.</p>
              <p><strong>13.2</strong> Geschillen zullen bij voorkeur in onderling overleg worden opgelost.</p>
              <p><strong>13.3</strong> Indien geen oplossing wordt bereikt, zijn uitsluitend de bevoegde rechtbanken in België bevoegd.</p>
              <p><strong>13.4</strong> Voor consumenten geldt dat zij binnen twee maanden na een schriftelijke klacht ook een klacht kunnen indienen bij de bevoegde overheidsinstantie.</p>
            </div>
          </section>

          {/* Artikel 14 */}
          <section className="bg-white p-8 rounded-2xl border-2 border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel 14: Wijziging Voorwaarden</h2>
            <p className="text-slate-700 leading-relaxed">
              Koubyte behoudt zich het recht voor deze algemene voorwaarden te wijzigen. De meest actuele versie is altijd te vinden op onze website. Wijzigingen treden in werking 30 dagen na bekendmaking op de website.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Vragen over deze Voorwaarden?</h2>
            <p className="text-slate-700 mb-4">
              Heeft u vragen over deze algemene voorwaarden? Neem gerust contact met ons op:
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

