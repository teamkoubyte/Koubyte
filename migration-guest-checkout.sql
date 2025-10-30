-- Migration: Guest checkout + kortingscode systeem
-- Voer dit uit in je Neon database console

-- 1. Voeg nieuwe velden toe aan Order tabel
ALTER TABLE "Order" 
  ADD COLUMN IF NOT EXISTS "discountAmount" DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "discountCode" TEXT,
  ADD COLUMN IF NOT EXISTS "finalAmount" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "firstName" TEXT,
  ADD COLUMN IF NOT EXISTS "lastName" TEXT,
  ADD COLUMN IF NOT EXISTS "company" TEXT,
  ADD COLUMN IF NOT EXISTS "street" TEXT,
  ADD COLUMN IF NOT EXISTS "houseNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "city" TEXT,
  ADD COLUMN IF NOT EXISTS "postalCode" TEXT,
  ADD COLUMN IF NOT EXISTS "country" TEXT,
  ADD COLUMN IF NOT EXISTS "isGuest" BOOLEAN DEFAULT false;

-- 2. Update bestaande orders: bereken finalAmount
UPDATE "Order" 
SET "finalAmount" = "totalAmount" 
WHERE "finalAmount" IS NULL;

-- 3. Maak finalAmount verplicht
ALTER TABLE "Order" 
  ALTER COLUMN "finalAmount" SET NOT NULL;

-- 4. Maak DiscountCode tabel
CREATE TABLE IF NOT EXISTS "DiscountCode" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "type" TEXT NOT NULL,
  "value" DOUBLE PRECISION NOT NULL,
  "minAmount" DOUBLE PRECISION,
  "maxUses" INTEGER,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "validUntil" TIMESTAMP(3),
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Maak index op code
CREATE INDEX IF NOT EXISTS "DiscountCode_code_idx" ON "DiscountCode"("code");

-- 6. Voeg test kortingscodes toe (optioneel)
INSERT INTO "DiscountCode" ("id", "code", "description", "type", "value", "minAmount", "active", "createdAt")
VALUES 
  (gen_random_uuid()::text, 'WELCOME10', '10% korting voor nieuwe klanten', 'percentage', 10, 0, true, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'SAVE20', '€20 korting bij bestelling boven €100', 'fixed', 20, 100, true, CURRENT_TIMESTAMP)
ON CONFLICT (code) DO NOTHING;

-- 7. Maak guest user als die nog niet bestaat
INSERT INTO "User" ("id", "email", "name", "password", "emailVerified", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 'guest@koubyte.be', 'Guest User', '', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

