
BEGIN;

-- Step 1: Add temporary UUID column with foreign key
ALTER TABLE auction_image_paths
  ADD COLUMN auction_uuid UUID,
  ADD FOREIGN KEY (auction_uuid) REFERENCES auctions(id); -- Reference UUID column

-- Step 2: Drop old column and rename new column in separate operations
ALTER TABLE auction_image_paths DROP COLUMN auction_id;
ALTER TABLE auction_image_paths RENAME COLUMN auction_uuid TO auction_id;

COMMIT;
