# Koubyte - IT-diensten Platform

Een modern en volledig functioneel platform voor freelance IT-diensten, gebouwd met Next.js, TypeScript, Tailwind CSS en shadcn/ui.

## 🚀 Functionaliteiten

- ✅ **Authenticatie**: Gebruikers kunnen inloggen en registreren met NextAuth
- ✅ **Afspraken boeken**: Volledig boeking systeem met datum, tijd en service selectie
- ✅ **Offerte aanvragen**: Offerten systeem voor complexe projecten
- ✅ **Contactformulier**: Email integratie met Nodemailer
- ✅ **FAQ pagina**: Antwoorden op veelgestelde vragen
- ✅ **Prijzen pagina**: Overzicht van diensten en pakketten
- ✅ **Over mij pagina**: Informatie over het bedrijf
- ✅ **Blog/Kennisbank**: Tips en handleidingen
- ✅ **Klantdashboard**: Overzicht van afspraken en status
- ✅ **Admin zone**: Beheer van aanvragen en klanten
- ✅ **Responsive design**: Werkt op mobiel, tablet en desktop
- ✅ **SEO-vriendelijk**: Meta tags en semantische HTML

## 🛠️ Technische Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui componenten
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL met Prisma ORM
- **Authenticatie**: NextAuth
- **Email**: Nodemailer

## 📦 Installatie

### 1. Clone of download het project

```bash
cd koubyte
```

### 2. Installeer dependencies

```bash
npm install
```

### 3. Configureer de database

Maak een PostgreSQL database aan en vul de `DATABASE_URL` in in je `.env` bestand.

### 4. Maak .env bestand

Kopieer `.env.example` naar `.env` en vul de waarden in:

```bash
cp .env.example .env
```

Vul de volgende variabelen in:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Een random secret key (genereren met: `openssl rand -base64 32`)
- `SMTP_*`: Email configuratie voor contactformulier en notificaties

### 5. Database setup

```bash
# Genereer Prisma client
npx prisma generate

# Maak migratie
npx prisma migrate dev --name init

# (Optioneel) Vul database met seed data
# npx prisma db seed
```

### 6. Start de development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## 🗄️ Database Schema

Het platform gebruikt de volgende tabellen:
- **User**: Gebruikers accounts
- **Appointment**: Afspraken met klanten
- **Quote**: Offerteaanvragen
- **Review**: Klantreviews
- **BlogPost**: Kennisbank artikelen
- **ContactMessage**: Contactformulier berichten

## 📁 Project Structuur

```
koubyte/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Inlog/registreer pagina's
│   ├── book/             # Afspraak boeken
│   ├── contact/           # Contact pagina
│   ├── about/             # Over mij pagina
│   ├── pricing/           # Prijzen pagina
│   ├── faq/               # FAQ pagina
│   ├── services/          # Diensten pagina
│   ├── blog/               # Blog/kennisbank
│   ├── dashboard/          # Klantdashboard
│   └── admin/                # Admin zone
├── components/
│   ├── ui/                # shadcn/ui componenten
│   ├── Navbar.tsx         # Navigatie
│   ├── Footer.tsx          # Footer
│   └── AdminDashboard.tsx # Admin dashboard
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── prisma.ts           # Prisma client
│   ├── email.ts            # Email functies
│   └── utils.ts            # Utility functies
└── prisma/
    └── schema.prisma       # Database schema
```

## 🔐 Admin Account Maken

Om een admin account te maken, voer direct een SQL query uit op de database:

```sql
-- Hashed password voor "admin123" met bcrypt
UPDATE "User" SET role = 'admin' WHERE email = 'jouw@email.be';
```

Of maak handmatig een admin account aan via een seed script.

## 📧 Email Configuratie

Voor het contactformulier en afspraakbevestigingen heb je SMTP configuratie nodig. Voor Gmail:

1. Maak een App Password aan in je Google Account
2. Gebruik dit wachtwoord in `SMTP_PASSWORD`

## 🎨 Customisatie

### Kleuren aanpassen

De kleuren zijn configureerbaar in `app/globals.css`:
- Primary: Blauw (#3B82F6)
- Secondary: Grijs
- Background: Wit

### Content aanpassen

- Homepage: `app/page.tsx`
- Diensten: `app/services/page.tsx`
- Prijzen: `app/pricing/page.tsx`
- FAQ: `app/faq/page.tsx`

## 🚀 Deployment

### Vercel (aanbevolen)

1. Push je code naar GitHub
2. Importeer in Vercel
3. Voeg environment variables toe
4. Maak database connection aan (Vercel Postgres of Railway)

### Andere platforms

Het project kan ook gerund worden op:
- Railway
- Render
- Fly.io
- AWS, GCP, Azure

## 📝 TODO / Verbeteringen

- [ ] Blog pagina met echte content
- [ ] Review systeem voltooien
- [ ] Offerten calculator
- [ ] Live chat functionaliteit
- [ ] PayPal/Bank integratie
- [ ] Kalender integratie
- [ ] SMS notificaties
- [ ] Multi-language support

## 📄 Licentie

Dit project is gemaakt voor Koubyte IT-diensten. Alle rechten voorbehouden.

## 🤝 Support

Voor vragen of problemen, neem contact op via info@koubyte.nl

---

Gemaakt met ❤️ voor Koubyte

