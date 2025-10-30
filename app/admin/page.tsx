import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Calendar, Users, MessageSquare, Star, Package, TrendingUp } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function AdminPage() {
  // Haal statistieken op
  const [
    totalAppointments,
    pendingAppointments,
    totalUsers,
    pendingReviews,
    totalOrders,
  ] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: 'pending' } }),
    prisma.user.count(),
    prisma.review.count({ where: { approved: false } }),
    prisma.order.count(),
  ])

  return (
    <div className="container mx-auto max-w-7xl py-6 sm:py-8 px-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 lg:mb-8">Admin Dashboard</h1>
      
      {/* Statistieken */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600">Totaal Gebruikers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600">Afspraken (In Behandeling)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{pendingAppointments}</div>
            <div className="text-xs sm:text-sm text-slate-500">van {totalAppointments} totaal</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600">Reviews te Beoordelen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{pendingReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600">Bestellingen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">{totalOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Snelle Links */}
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Beheer</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Link href="/admin/appointments">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-500 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                Afspraken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-slate-600">Bekijk en beheer alle afspraken</p>
              {pendingAppointments > 0 && (
                <div className="mt-3 inline-block bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  {pendingAppointments} nieuw
                </div>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-500 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                Gebruikers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-slate-600">Beheer gebruikers en accounts</p>
              <div className="mt-3 text-xs sm:text-sm text-slate-500">{totalUsers} geregistreerd</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-500 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                Bestellingen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-slate-600">Bekijk en verwerk bestellingen</p>
              <div className="mt-3 text-xs sm:text-sm text-slate-500">{totalOrders} totaal</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/messages">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-orange-500 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                Berichten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-slate-600">Contact berichten beheren</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/reviews">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-yellow-500 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-slate-600">Modereer klant reviews</p>
              {pendingReviews > 0 && (
                <div className="mt-3 inline-block bg-yellow-100 text-yellow-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  {pendingReviews} te beoordelen
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

