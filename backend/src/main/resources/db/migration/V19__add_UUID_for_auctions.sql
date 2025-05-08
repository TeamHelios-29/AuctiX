ALTER TABLE auctions ADD COLUMN uuid UUID DEFAULT gen_random_uuid();


UPDATE auctions SET uuid = gen_random_uuid() WHERE uuid IS NULL;


ALTER TABLE auctions DROP id CASCADE;
ALTER TABLE auctions ADD PRIMARY KEY (uuid);



ALTER TABLE auctions RENAME COLUMN uuid TO id;
