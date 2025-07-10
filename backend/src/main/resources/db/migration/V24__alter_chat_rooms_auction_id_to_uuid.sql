ALTER TABLE chat_rooms DROP COLUMN auction_id;

ALTER TABLE chat_rooms ADD COLUMN auction_id UUID;

ALTER TABLE chat_rooms
    ADD CONSTRAINT chat_rooms_auction_id_fkey
    FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE SET NULL;