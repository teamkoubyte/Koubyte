-- Voeg paymentMethod veld toe aan Order tabel

ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT NOT NULL DEFAULT 'bancontact';

-- Check resultaat
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'Order' AND column_name = 'paymentMethod';

