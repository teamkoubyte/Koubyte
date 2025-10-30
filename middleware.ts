import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Decode NextAuth token (requires NEXTAUTH_SECRET)
	const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
	const userRole = (token as any)?.role as string | undefined

	// 1) Force admins naar /admin wanneer ze publieke routes bezoeken
	if (userRole === 'admin') {
		const isAdminArea = pathname.startsWith('/admin')
		const isApi = pathname.startsWith('/api')
		const isNext = pathname.startsWith('/_next')
		const isStaticAsset = /\.(.*)$/.test(pathname)
		const isSystemAsset = (
			pathname.startsWith('/favicon') ||
			pathname.startsWith('/icon') ||
			pathname.startsWith('/apple-icon') ||
			pathname.startsWith('/opengraph-image') ||
			pathname.startsWith('/robots') ||
			pathname.startsWith('/sitemap') ||
			pathname.startsWith('/manifest')
		)

		if (!isAdminArea && !isApi && !isNext && !isStaticAsset && !isSystemAsset) {
			const url = new URL('/admin', request.url)
			return NextResponse.redirect(url)
		}
	}

	// 2) Bescherm /admin voor niet-admins
	if (pathname.startsWith('/admin')) {
		if (!userRole) {
			return NextResponse.redirect(new URL('/auth/login', request.url))
		}
		if (userRole !== 'admin') {
			return NextResponse.redirect(new URL('/', request.url))
		}
	}

	return NextResponse.next()
}

// Match alle routes behalve _next en bestanden met extensies; api wordt binnen de middleware uitgesloten
export const config = {
	matcher: ['/((?!_next).*)'],
}


