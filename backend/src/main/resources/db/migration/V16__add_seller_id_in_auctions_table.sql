ALTER TABLE auctions
ADD COLUMN seller_id UUID NOT NULL,
ADD CONSTRAINT fk_seller FOREIGN KEY (seller_id) REFERENCES sellers(id);
