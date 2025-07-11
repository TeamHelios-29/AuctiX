-- Add missing columns to user_addresses table (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_addresses' AND column_name = 'city') THEN
ALTER TABLE user_addresses ADD COLUMN city VARCHAR(255);
END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_addresses' AND column_name = 'state') THEN
ALTER TABLE user_addresses ADD COLUMN state VARCHAR(255);
END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_addresses' AND column_name = 'postal_code') THEN
ALTER TABLE user_addresses ADD COLUMN postal_code VARCHAR(20);
END IF;
END $$;