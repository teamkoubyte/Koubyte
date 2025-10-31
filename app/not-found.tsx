import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft, Home } from 'lucide-react'

// Deze pagina moet dynamisch zijn omdat layout getServerSession gebruikt
export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 border-2 border-slate-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-orange-100 rounded-full p-6">
              <AlertCircle className="w-16 h-16 text-orange-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Pagina niet gevonden
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-600 mb-8">
            De pagina die je zoekt bestaat niet of is verplaatst.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Home className="w-5 h-5" />
                Terug naar home
              </Button>
            </Link>

            <Link href="/diensten">
              <Button size="lg" variant="outline" className="gap-2">
                <ArrowLeft className="w-5 h-5" />
                Bekijk diensten
              </Button>
            </Link>
          </div>

          {/* Help */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Kun je niet vinden wat je zoekt?{' '}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Neem contact met ons op
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

