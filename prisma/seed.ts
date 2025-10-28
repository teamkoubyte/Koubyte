import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Maak een testgebruiker aan
  const hashedPassword = await bcrypt.hash('demo123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@koubyte.be' },
    update: {},
    create: {
      email: 'admin@koubyte.be',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
      phone: '+32 484 52 26 62',
      address: 'België',
    },
  })

  const testClient = await prisma.user.upsert({
    where: { email: 'klant@example.be' },
    update: {},
    create: {
      email: 'klant@example.be',
      name: 'Test Klant',
      password: hashedPassword,
      role: 'client',
      phone: '+32 470 12 34 56',
    },
  })

  // Maak een voorbeeldafspraak
  const appointment = await prisma.appointment.create({
    data: {
      userId: testClient.id,
      date: '2024-02-15',
      time: '14:00',
      service: 'Hardware reparatie',
      description: 'Laptop maakt veel lawaai, waarschijnlijk koelingsprobleem',
      status: 'pending',
    },
  })

  // Maak voorbeeldreview
  const review = await prisma.review.create({
    data: {
      userId: testClient.id,
      name: 'Test Klant',
      rating: 5,
      comment: 'Zeer snelle service en goed opgelost!',
      service: 'Software installatie',
      approved: true,
    },
  })

  // Maak voorbeeldblog post
  const blogPost = await prisma.blogPost.create({
    data: {
      title: '10 tips om je computer snel te houden',
      slug: 'tips-snelle-computer',
      excerpt: 'Leer hoe je je computer optimaal kunt houden zonder dure software of upgrades.',
      content: 'Dit is de volledige content van het artikel...',
      category: 'Onderhoud',
      tags: 'onderhoud,tips,optimalisatie',
      published: true,
    },
  })

  console.log('Seeding completed!')
  console.log({ admin, testClient, appointment, review, blogPost })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

