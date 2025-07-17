-- Add deleted_at column to auctions table
ALTER TABLE auctions ADD COLUMN deleted_at TIMESTAMP;
