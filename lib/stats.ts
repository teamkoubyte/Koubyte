import { prisma } from './prisma'

// Deze functie haalt ECHTE statistieken op uit de database
export async function getRealStats() {
  try {
    // Haal ECHTE data op
    const [
      totalUsers,
      totalAppointments,
      approvedReviews,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'client' } }), // Alleen klanten, geen admins
      prisma.appointment.count({ where: { status: { in: ['completed', 'confirmed'] } } }), // Alleen echte afspraken
      prisma.review.findMany({ where: { approved: true } }), // Alleen goedgekeurde reviews
    ])

    // Bereken ECHTE gemiddelde rating
    const averageRating = approvedReviews.length > 0
      ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length
      : 0

    return {
      totalClients: totalUsers,
      totalAppointments: totalAppointments,
      totalReviews: approvedReviews.length,
      averageRating: Number(averageRating.toFixed(1)),
    }
  } catch (error) {
    console.error('Error fetching real stats:', error)
    // Return minimale echte data als fallback
    return {
      totalClients: 0,
      totalAppointments: 0,
      totalReviews: 0,
      averageRating: 0,
    }
  }
}

