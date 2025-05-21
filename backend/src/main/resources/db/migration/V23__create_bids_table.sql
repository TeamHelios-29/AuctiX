CREATE TABLE IF NOT EXISTS bids (
                                    id UUID PRIMARY KEY,
                                    auction_id UUID NOT NULL,
                                    bidder_id UUID NOT NULL,
                                    bidder_name VARCHAR(255) NOT NULL,
    bidder_avatar VARCHAR(255),
    amount DECIMAL(19, 2) NOT NULL,
    bid_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auction FOREIGN KEY (auction_id) REFERENCES auctions(id)
    );

CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_amount ON bids(amount);