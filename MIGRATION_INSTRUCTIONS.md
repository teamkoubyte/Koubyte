# 🔄 Password Reset Tabel Migration - Snelle Setup

## ✅ Oplossing: API Route Migration

Ik heb een **automatische migration API route** gemaakt die de tabel voor je aanmaakt wanneer je app draait.

## 🚀 Stappen

### 1. Start je Development Server

```bash
npm run dev
```

### 2. Voer de Migration Uit

Open je browser en ga naar:
```
http://localhost:3000/api/migrate/password-reset
```

**Of via terminal:**
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/migrate/password-reset" -Method POST

# Bash/curl
curl -X POST http://localhost:3000/api/migrate/password-reset
```

**Of via de browser:**
- Ga naar `http://localhost:3000`
- Open Developer Tools (F12)
- Ga naar Console
- Type: `fetch('/api/migrate/password-reset', {method: 'POST'}).then(r => r.json()).then(console.log)`

### 3. Check Resultaat

Je zou moeten zien:
```json
{
  "message": "✅ ResetPasswordToken tabel succesvol aangemaakt!"
}
```

## 🔍 Wat doet deze route?

- ✅ Checkt of de tabel al bestaat (voorkomt errors)
- ✅ Maakt de `ResetPasswordToken` tabel aan
- ✅ Maakt alle indexes aan
- ✅ Werkt met SQLite en PostgreSQL automatisch

## 🎯 Alternatief: Handmatig via Database Client

Als de API route niet werkt, gebruik dan je database client (Prisma Studio, DBeaver, pgAdmin):

### SQLite:
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

### PostgreSQL:
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

## ✅ Na de Migration

Na het aanmaken van de tabel werkt de password reset functionaliteit automatisch:

1. Ga naar `/auth/login`
2. Klik op "Wachtwoord vergeten?"
3. Voer je email in
4. Check je inbox voor reset link (of console in development)
5. Reset je wachtwoord via de link

De code is al volledig geïmplementeerd en klaar! 🎉

