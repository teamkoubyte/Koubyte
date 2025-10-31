import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Calendar, Users, MessageSquare, Star, Package, TrendingUp, DollarSign, FileText, CreditCard } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function AdminPage() {
  try {
    // Haal statistieken op
    const [
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      totalUsers,
      pendingReviews,
      totalOrders,
      paidOrders,
      totalRevenue,
      pendingQuotes,
      totalQuotes,
      newMessages,
      todayAppointments,
    ] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'pending' } }),
      prisma.appointment.count({ where: { status: 'confirmed' } }),
      prisma.user.count(),
      prisma.review.count({ where: { approved: false } }),
      prisma.order.count(),
      prisma.order.count({ where: { paymentStatus: 'paid' } }),
      prisma.order.aggregate({
        where: { paymentStatus: 'paid' },
        _sum: { finalAmount: true },
      }).catch(() => ({ _sum: { finalAmount: null } })),
      prisma.quote.count({ where: { status: 'pending' } }),
      prisma.quote.count(),
      prisma.contactMessage.count({ where: { status: 'new' } }),
      prisma.appointment.count({
        where: {
          date: new Date().toISOString().split('T')[0],
        },
      }),
    ])

    const revenue = totalRevenue._sum?.finalAmount || 0

    // Haal recente activiteiten op
    const [
      recentOrders,
      recentAppointments,
      recentQuotes,
      recentMessages,
    ] = await Promise.all([
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }).catch(() => []),
      prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }).catch(() => []),
      prisma.quote.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }).catch(() => []),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }).catch(() => []),
    ])

    return (
    <div className="container mx-auto max-w-7xl py-6 sm:py-8 px-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 lg:mb-8">Admin Dashboard</h1>
      
      {/* Statistieken - Uitgebreid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="border-2 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Totaal Gebruikers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{totalUsers}</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Klanten & accounts</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Afspraken Vandaag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{todayAppointments}</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">
              {pendingAppointments} in behandeling • {confirmedAppointments} bevestigd
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Totaal Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              €{revenue.toFixed(2).replace('.', ',')}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">
              {paidOrders} betaalde bestellingen
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Offertes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">{pendingQuotes}</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">
              {pendingQuotes} in behandeling • {totalQuotes} totaal
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tweede rij statistieken */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Bestellingen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">{totalOrders}</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Totaal bestellingen</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Reviews te Beoordelen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{pendingReviews}</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Wachten op moderatie</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Nieuwe Berichten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">{newMessages}</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Ongelezen contactberichten</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Totale Afspraken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{totalAppointments}</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">
              {pendingAppointments} pending • {confirmedAppointments} bevestigd
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recente Activiteiten */}
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Recente Activiteiten</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Recente Bestellingen */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Recente Bestellingen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">
                        {order.customerName || order.user?.name || 'Gast'}
                      </p>
                      <p className="text-xs text-slate-600">{order.orderNumber}</p>
                      <p className="text-xs text-slate-500">
                        €{order.finalAmount?.toFixed(2).replace('.', ',') || order.totalAmount.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    <div className="ml-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Geen recente bestellingen</p>
              )}
            </div>
            <Link href="/admin/orders">
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Bekijk alle bestellingen →
              </button>
            </Link>
          </CardContent>
        </Card>

        {/* Recente Afspraken */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Recente Afspraken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">
                        {apt.user?.name || 'Gast'}
                      </p>
                      <p className="text-xs text-slate-600">{apt.service}</p>
                      <p className="text-xs text-slate-500">
                        {apt.date} om {apt.time}
                      </p>
                    </div>
                    <div className="ml-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Geen recente afspraken</p>
              )}
            </div>
            <Link href="/admin/appointments">
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Bekijk alle afspraken →
              </button>
            </Link>
          </CardContent>
        </Card>

        {/* Recente Offertes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Recente Offertes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentQuotes.length > 0 ? (
                recentQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">{quote.name}</p>
                      <p className="text-xs text-slate-600 truncate">{quote.service}</p>
                      {quote.estimatedPrice && (
                        <p className="text-xs text-slate-500">
                          €{quote.estimatedPrice.toFixed(2).replace('.', ',')}
                        </p>
                      )}
                    </div>
                    <div className="ml-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        quote.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        quote.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        quote.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {quote.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Geen recente offertes</p>
              )}
            </div>
            <Link href="/admin/quotes">
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Bekijk alle offertes →
              </button>
            </Link>
          </CardContent>
        </Card>

        {/* Recente Berichten */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              Recente Berichten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMessages.length > 0 ? (
                recentMessages.map((msg) => (
                  <div key={msg.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">{msg.name}</p>
                      <p className="text-xs text-slate-600 truncate">{msg.subject}</p>
                      <p className="text-xs text-slate-500 truncate">{msg.email}</p>
                    </div>
                    <div className="ml-3">
                      {msg.status === 'new' && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-700">
                          Nieuw
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Geen recente berichten</p>
              )}
            </div>
            <Link href="/admin/messages">
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Bekijk alle berichten →
              </button>
            </Link>
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

        <Link href="/admin/calendar">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-400 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                Kalender
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-slate-600">Bekijk afspraken in kalender weergave</p>
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

        <Link href="/admin/quotes">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-500 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                Offertes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-slate-600">Beheer offerte aanvragen</p>
              {pendingQuotes > 0 && (
                <div className="mt-3 inline-block bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  {pendingQuotes} in behandeling
                </div>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/services">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-indigo-500 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-slate-600">Beheer diensten catalogus</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/blog">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-teal-500 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
                Blog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-slate-600">Beheer blog artikelen</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/chat">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-cyan-500 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-slate-600">Beheer live chat gesprekken</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/payments">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-emerald-500 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                Betalingen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-slate-600">Bekijk en beheer alle betalingen</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
    )
  } catch (error: any) {
    console.error('Error loading admin page:', error)
    // Return error page
    return (
      <div className="container mx-auto max-w-7xl py-6 sm:py-8 px-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-900 mb-4">Fout bij laden admin dashboard</h1>
          <p className="text-red-700 mb-2">Er is een fout opgetreden bij het ophalen van de data.</p>
          <p className="text-sm text-red-600">
            {error?.message || 'Onbekende fout'}
          </p>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-red-600">Technische details</summary>
            <pre className="mt-2 text-xs bg-red-100 p-3 rounded overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    )
  }
}

