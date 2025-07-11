-- Create auction_image_paths table if it doesn't exist
CREATE TABLE IF NOT EXISTS auction_image_paths (
                                                   auction_id UUID NOT NULL,
                                                   image_id UUID NOT NULL,
                                                   PRIMARY KEY (auction_id, image_id),
    CONSTRAINT fk_auction_id FOREIGN KEY (auction_id) REFERENCES auctions(id)
    );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_auction_image_paths_auction_id ON auction_image_paths(auction_id);