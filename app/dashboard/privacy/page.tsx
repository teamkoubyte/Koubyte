'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Trash2, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PrivacyDashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [exportSuccess, setExportSuccess] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // GDPR Recht op Inzage - Data Export
  const handleDataExport = async () => {
    setLoading(true)
    setExportSuccess(false)

    try {
      const response = await fetch('/api/gdpr/export', {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()
        
        // Download als JSON bestand
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `mijn-gegevens-koubyte-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        setExportSuccess(true)
        setTimeout(() => setExportSuccess(false), 5000)
      } else {
        showToast('Er ging iets mis bij het exporteren van je gegevens.', 'error')
      }
    } catch (error) {
      console.error('Export error:', error)
      showToast('Er ging iets mis. Probeer het opnieuw.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // GDPR Recht op Verwijdering
  const handleAccountDeletion = async () => {
    if (deleteConfirm !== 'VERWIJDER') {
      showToast('Typ "VERWIJDER" om te bevestigen', 'error')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/gdpr/delete', {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeleteSuccess(true)
        setTimeout(() => {
          signOut({ callbackUrl: '/' })
        }, 3000)
      } else {
        showToast('Er ging iets mis bij het verwijderen van je account.', 'error')
      }
    } catch (error) {
      console.error('Delete error:', error)
      showToast('Er ging iets mis. Probeer het opnieuw.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (deleteSuccess) {
    return (
      <div className="container mx-auto max-w-2xl py-16 px-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold mb-2 text-green-800">Account verwijderd</h2>
            <p className="text-green-700">Je account en alle gegevens zijn verwijderd. Je wordt uitgelogd...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-16 px-4">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100000] border-2 rounded-lg shadow-2xl p-4 min-w-[280px] max-w-md animate-slideInRight ${
          toast.type === 'success' ? 'bg-green-50 border-green-500 text-green-900' : toast.type === 'error' ? 'bg-red-50 border-red-500 text-red-900' : 'bg-blue-50 border-blue-500 text-blue-900'
        }`}>
          <div className="flex items-start gap-3">
            <span className="font-semibold flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">×</button>
          </div>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy & Gegevens</h1>
        <p className="text-slate-600">
          Beheer je persoonlijke gegevens volgens de AVG/GDPR wetgeving
        </p>
      </div>

      <div className="space-y-6">
        {/* Jouw Rechten */}
        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle>Jouw Privacy Rechten</CardTitle>
                <CardDescription>
                  Onder de AVG/GDPR heb je volledige controle over je gegevens
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-semibold text-green-800">✓ Recht op inzage</p>
                <p className="text-slate-600">Download al je gegevens</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-semibold text-green-800">✓ Recht op verwijdering</p>
                <p className="text-slate-600">Verwijder je account</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-semibold text-green-800">✓ Recht op rectificatie</p>
                <p className="text-slate-600">Pas je gegevens aan</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-semibold text-green-800">✓ Recht op overdraagbaarheid</p>
                <p className="text-slate-600">Export in JSON formaat</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle>Mijn Gegevens Downloaden</CardTitle>
                <CardDescription>
                  Exporteer al je persoonlijke gegevens in een leesbaar bestand (GDPR Artikel 15 & 20)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-700 mb-3">
                Je download bevat:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                <li>Accountinformatie (naam, email)</li>
                <li>Gemaakte afspraken</li>
                <li>Contactformulier berichten</li>
                <li>Account aanmaakdatum</li>
              </ul>
            </div>

            {exportSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Je gegevens zijn gedownload!</span>
              </div>
            )}

            <Button
              onClick={handleDataExport}
              disabled={loading}
              className="w-full md:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Bezig met downloaden...' : 'Download Mijn Gegevens'}
            </Button>
          </CardContent>
        </Card>

        {/* Account Verwijderen */}
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <CardTitle className="text-red-900">Account Verwijderen</CardTitle>
                <CardDescription>
                  Verwijder permanent je account en alle gegevens (GDPR Artikel 17)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="font-semibold text-red-900 mb-2">⚠️ Let op: Dit kan niet ongedaan worden gemaakt!</p>
              <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                <li>Je account wordt permanent verwijderd</li>
                <li>Al je persoonlijke gegevens worden gewist</li>
                <li>Je afspraken en berichtengeschiedenis verdwijnen</li>
                <li>Facturen worden 7 jaar bewaard (wettelijke verplichting)</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Typ &quot;VERWIJDER&quot; om te bevestigen:
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="VERWIJDER"
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            </div>

            <Button
              onClick={handleAccountDeletion}
              disabled={loading || deleteConfirm !== 'VERWIJDER'}
              variant="destructive"
              className="w-full md:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {loading ? 'Bezig met verwijderen...' : 'Account Permanent Verwijderen'}
            </Button>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-slate-700 mb-2">
              <strong>Vragen over je privacy of gegevens?</strong>
            </p>
            <p className="text-slate-600 mb-4">
              Neem contact met ons op via <a href="mailto:info@koubyte.be" className="text-blue-600 hover:text-blue-700 font-semibold underline">info@koubyte.be</a> of bekijk ons complete <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold underline">privacybeleid</a>.
            </p>
            <p className="text-sm text-slate-500">
              Klachten kunnen ook ingediend worden bij de Gegevensbeschermingsautoriteit (GBA): www.gegevensbeschermingsautoriteit.be
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

