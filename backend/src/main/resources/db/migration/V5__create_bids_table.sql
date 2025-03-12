-- src/main/resources/db/migration/V4__create_bid_table.sql
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    amount NUMERIC NOT NULL,
    bid_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);