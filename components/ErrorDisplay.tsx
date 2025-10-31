'use client'

interface ErrorDisplayProps {
  error: any
  title?: string
  message?: string
}

export default function ErrorDisplay({ error, title = 'Fout opgetreden', message }: ErrorDisplayProps) {
  return (
    <div className="container mx-auto max-w-7xl py-6 sm:py-8 px-4">
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-red-900 mb-4">{title}</h1>
        {message && (
          <p className="text-red-700 mb-2">{message}</p>
        )}
        <p className="text-sm text-red-600 mb-4">
          {error?.message || error?.name || 'Onbekende fout'}
        </p>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-red-600 font-semibold hover:text-red-700">
            Technische details (klik om uit te klappen)
          </summary>
          <pre className="mt-2 text-xs bg-red-100 p-4 rounded overflow-auto max-h-96 border border-red-300">
            {JSON.stringify(
              {
                name: error?.name,
                message: error?.message,
                code: error?.code,
                meta: error?.meta,
                stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
                ...(error && typeof error === 'object' ? error : {}),
              },
              null,
              2
            )}
          </pre>
        </details>
        {error?.code === 'P2021' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Database tabel ontbreekt:</strong> Deze tabel bestaat niet in de database.
              Voer <code className="bg-yellow-100 px-2 py-1 rounded">npx prisma migrate dev</code> uit om de database te synchroniseren.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

