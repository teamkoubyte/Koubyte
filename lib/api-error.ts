import { NextResponse } from 'next/server'

interface ErrorResponse {
  error: string
  details?: any
  code?: string
  meta?: any
}

/**
 * Helper functie voor consistente error responses met gedetailleerde informatie
 */
export function createErrorResponse(
  error: any,
  defaultMessage: string = 'Er ging iets mis',
  status: number = 500
): NextResponse<ErrorResponse> {
  console.error('API Error:', error)

  // Prisma errors
  if (error?.code === 'P2021') {
    return NextResponse.json(
      {
        error: `Database tabel ontbreekt: ${error.meta?.table || 'onbekende tabel'}`,
        details: error.message,
        code: error.code,
        meta: error.meta,
        hint: 'Voer `npx prisma migrate dev` uit om de database te synchroniseren',
      },
      { status: 500 }
    )
  }

  if (error?.code === 'P2025') {
    return NextResponse.json(
      {
        error: 'Record niet gevonden',
        details: error.message,
        code: error.code,
        meta: error.meta,
      },
      { status: 404 }
    )
  }

  // Zod validation errors
  if (error?.errors && Array.isArray(error.errors)) {
    return NextResponse.json(
      {
        error: 'Validatie fout',
        details: error.errors.map((e: any) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    )
  }

  // Generic errors
  return NextResponse.json(
    {
      error: error?.message || defaultMessage,
      details: process.env.NODE_ENV === 'development' ? {
        name: error?.name,
        stack: error?.stack,
        code: error?.code,
        meta: error?.meta,
      } : undefined,
      code: error?.code,
      meta: error?.meta,
    },
    { status }
  )
}

