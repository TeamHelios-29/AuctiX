
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY,
    country VARCHAR(50),
    address_number VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    CONSTRAINT fk_user_address FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE
);

ALTER TABLE Users
    ADD COLUMN profile_photo_id INT NULL;

ALTER TABLE Users
    ADD CONSTRAINT fk_profile_photo FOREIGN KEY (profile_photo_id) REFERENCES uploads(id) ON DELETE SET NULL;