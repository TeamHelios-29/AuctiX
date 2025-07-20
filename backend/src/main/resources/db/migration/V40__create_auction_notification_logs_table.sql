CREATE TABLE auction_notification_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_id uuid NOT NULL,
    category varchar(32) NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    CONSTRAINT fk_auction
        FOREIGN KEY (auction_id)
        REFERENCES auctions(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_auction_id ON auction_notification_log (auction_id);
CREATE INDEX idx_category ON auction_notification_log (category);