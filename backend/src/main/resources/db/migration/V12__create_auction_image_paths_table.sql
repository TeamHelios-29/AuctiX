-- V2__create_auction_image_paths_table.sql
CREATE TABLE auction_image_paths (
    auction_id BIGINT NOT NULL,
    image_paths VARCHAR(255),
    FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE
);

-- Optional: Add an index for better performance
CREATE INDEX idx_auction_image_paths_auction_id ON auction_image_paths(auction_id);