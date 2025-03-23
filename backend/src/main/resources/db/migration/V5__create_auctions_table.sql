CREATE TABLE auctions (
    id SERIAL PRIMARY KEY, -- Unique identifier for the auction
    title VARCHAR(255) NOT NULL, -- Title of the auction
    description TEXT NOT NULL, -- Description of the auction
    starting_price NUMERIC NOT NULL, -- Starting price of the auction
    start_time TIMESTAMP NOT NULL, -- Start time of the auction
    end_time TIMESTAMP NOT NULL, -- End time of the auction
    is_public BOOLEAN NOT NULL, -- Whether the auction is public
    category VARCHAR(100), -- Category of the auction (e.g., electronics, fashion)
    image_paths TEXT[], -- Array of image paths (optional, for storing multiple images)
    created_at TIMESTAMP NOT NULL, -- Timestamp when the auction was created
    updated_at TIMESTAMP NOT NULL -- Timestamp when the auction was last updated
);