# 🔐 Password Reset Functionaliteit - Setup Instructies

## ✅ Wat is al geïmplementeerd

- ✅ **Database Schema**: `ResetPasswordToken` model toegevoegd aan `prisma/schema.prisma`
- ✅ **Migration File**: SQL migration aangemaakt in `prisma/migrations/20251030235516_add_password_reset_token/migration.sql`
- ✅ **API Routes**: 
  - `POST /api/auth/reset/request` - Reset link aanvragen
  - `POST /api/auth/reset/verify` - Wachtwoord resetten
- ✅ **Frontend Pagina's**:
  - `/auth/forgot-password` - Reset link aanvragen
  - `/auth/reset-password` - Nieuw wachtwoord instellen
- ✅ **Email Template**: Professionele HTML email template
- ✅ **Login Pagina**: "Wachtwoord vergeten?" link toegevoegd

## 🚀 Setup Stappen

### Stap 1: Database Migratie Uitvoeren

Voer deze commando's uit wanneer je `DATABASE_URL` correct is geconfigureerd:

```bash
# Genereer Prisma client met nieuwe schema
npx prisma generate

# Voer de migration uit
npx prisma migrate deploy
```

**Of handmatig via je database client:**

Als je database client hebt (bijv. DBeaver, pgAdmin, TablePlus), voer dan de SQL uit uit dit bestand:
- `prisma/migrations/20251030235516_add_password_reset_token/migration.sql`

**Of via Prisma Studio:**
```bash
npx prisma studio
# Navigeer naar je database en voer de SQL handmatig uit
```

### Stap 2: Environment Variabele (Optioneel)

Voor production, voeg toe aan je `.env`:
```env
NEXT_PUBLIC_BASE_URL=https://koubyte.be
```

In development gebruikt het automatisch `http://localhost:3000`.

### Stap 3: Testen

1. Ga naar `/auth/login`
2. Klik op "Wachtwoord vergeten?"
3. Voer je email in
4. Check je inbox voor reset link (of console log in development)
5. Reset je wachtwoord via de link

## 📋 SQL Migration (Handmatig Uitvoeren)

Als Prisma migrate niet werkt, voer deze SQL handmatig uit in je database:

### Voor SQLite:
```sql
CREATE TABLE "ResetPasswordToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ResetPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "ResetPasswordToken_token_key" ON "ResetPasswordToken"("token");
CREATE INDEX "ResetPasswordToken_userId_idx" ON "ResetPasswordToken"("userId");
CREATE INDEX "ResetPasswordToken_token_idx" ON "ResetPasswordToken"("token");
CREATE INDEX "ResetPasswordToken_expiresAt_idx" ON "ResetPasswordToken"("expiresAt");
```

### Voor PostgreSQL:
```sql
CREATE TABLE IF NOT EXISTS "ResetPasswordToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ResetPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "ResetPasswordToken_token_key" ON "ResetPasswordToken"("token");
CREATE INDEX IF NOT EXISTS "ResetPasswordToken_userId_idx" ON "ResetPasswordToken"("userId");
CREATE INDEX IF NOT EXISTS "ResetPasswordToken_token_idx" ON "ResetPasswordToken"("token");
CREATE INDEX IF NOT EXISTS "ResetPasswordToken_expiresAt_idx" ON "ResetPasswordToken"("expiresAt");
```

## 🔒 Security Features

- ✅ **User Enumeration Prevention**: Altijd succesvol antwoord, ook als email niet bestaat
- ✅ **Token Expiry**: Reset tokens zijn 1 uur geldig
- ✅ **Single-Use Tokens**: Elke token kan slechts één keer gebruikt worden
- ✅ **Secure Random Tokens**: 32 bytes (64 hex characters) cryptografisch veilige tokens
- ✅ **Automatic Cleanup**: Oude tokens worden automatisch gemarkeerd als gebruikt
- ✅ **Password Strength**: Minimaal 8 tekens met hoofdletter, kleine letter en cijfer

## 📝 Notities

- De functionaliteit werkt al in de code
- Alleen de database tabel moet nog aangemaakt worden
- Na de migration werkt alles automatisch
- Migration file staat klaar: `prisma/migrations/20251030235516_add_password_reset_token/migration.sql`

