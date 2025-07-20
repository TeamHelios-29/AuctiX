CREATE TABLE auction_watch_list (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    auction_id UUID NOT NULL,
    watched_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT uq_user_auction UNIQUE (user_id, auction_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_auction FOREIGN KEY (auction_id) REFERENCES auctions(id)
);
