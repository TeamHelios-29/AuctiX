ALTER TABLE auctions
    ADD COLUMN completed BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE auctions
    ADD COLUMN winning_bid_id UUID;

-- Create delivery status enum type
CREATE TYPE delivery_status AS ENUM ('PACKING', 'SHIPPING', 'DELIVERED', 'CANCELLED');

-- Create deliveries table
CREATE TABLE deliveries (
                            id UUID PRIMARY KEY,
                            auction_id UUID NOT NULL REFERENCES auctions(id),
                            seller_id UUID NOT NULL REFERENCES users(id),
                            buyer_id UUID NOT NULL REFERENCES users(id),
                            delivery_date DATE NOT NULL,
                            status delivery_status NOT NULL,
                            delivery_address VARCHAR(500),
                            notes VARCHAR(500),
                            amount DOUBLE PRECISION NOT NULL,
                            tracking_number VARCHAR(100),
                            created_at TIMESTAMP NOT NULL,
                            updated_at TIMESTAMP NOT NULL
);

-- Create index for faster lookups
CREATE INDEX idx_deliveries_auction_id ON deliveries(auction_id);
CREATE INDEX idx_deliveries_seller_id ON deliveries(seller_id);
CREATE INDEX idx_deliveries_buyer_id ON deliveries(buyer_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);

-- Create user_addresses table if not exists
CREATE TABLE IF NOT EXISTS user_addresses (
                                              id UUID PRIMARY KEY,
                                              address_line1 VARCHAR(100),
    address_line2 VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id)
    );