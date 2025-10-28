import { Card, CardContent } from '@/components/ui/card'
import { Check, Shield, Users, Award, Wrench } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Over Koubyte</h1>
        <p className="text-xl text-slate-600">
          Jouw IT-partner die er is wanneer je computer weer eens gek doet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Hoe Koubyte is ontstaan</h2>
          <p className="text-slate-600 mb-4">
            Koubyte is geboren uit een simpele gedachte: iedereen verdient toegankelijke IT-hulp zonder gedoe. 
            Wat begon als het helpen van vrienden en familie met computerproblemen is uitgegroeid tot een 
            professionele dienst voor particulieren en kleine bedrijven in de regio.
          </p>
          <p className="text-slate-600 mb-4">
            Bij Koubyte snappen we dat computers soms frustrerend kunnen zijn. Daarom leggen we alles uit in 
            gewone mensentaal, zonder ingewikkelde IT-termen waar niemand iets aan heeft. Na ons bezoek begrijp 
            je niet alleen wat er mis was, maar ook hoe je het in de toekomst kunt voorkomen.
          </p>
          <p className="text-slate-600">
            Of het nu gaat om je werkcomputer die vastloopt tijdens een belangrijke deadline, of een laptop 
            die ineens raar doet - we helpen iedereen met evenveel geduld en enthousiasme. Want technologie 
            zou ons leven makkelijker moeten maken, niet moeilijker.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Waarom mensen voor Koubyte kiezen</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                <span>Meestal zijn we er dezelfde dag nog - want wie wil er nu wachten?</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                <span>Geen technisch gebabbel - gewoon uitleg die je begrijpt</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                <span>Je weet vooraf wat het kost, geen verrassingen achteraf</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                <span>We nemen de tijd, ook voor vragen die simpel lijken</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                <span>Van studenten tot bedrijven - iedereen is welkom</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">Koubyte houdt zich aan zijn woord</h3>
            <p className="text-sm text-slate-600">
              Beloofd is beloofd. Als we zeggen dat we er om 14u zijn, dan zijn we er om 14u.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">Jij bent de baas</h3>
            <p className="text-sm text-slate-600">
              Jouw probleem, jouw oplossing. Koubyte adviseert, jij beslist. Simpel toch?
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Award className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">Koubyte heeft het al vaker gezien</h3>
            <p className="text-sm text-slate-600">
              Van Windows 95 tot de nieuwste Mac - we hebben met bijna alles gewerkt
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50">
        <CardContent className="pt-6 text-center">
          <Wrench className="h-16 w-16 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold mb-4">Zullen we je probleem oplossen?</h2>
          <p className="text-slate-600 mb-6">
            Of het nu je eigen laptop is die niet meer opstart, of het hele netwerk op kantoor dat vast zit - 
            neem gerust contact op met Koubyte. We staan voor je klaar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/book" className="inline-block">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700">
                Plan een afspraak
              </button>
            </a>
            <a href="/contact" className="inline-block">
              <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-md hover:bg-blue-50">
                Neem contact op
              </button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

