
CREATE TABLE user_address (
    id UUID PRIMARY KEY,
    country VARCHAR(50),
    address_number VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255)
);

ALTER TABLE Users
    ADD COLUMN profile_picture_id SERIAL,
    ADD CONSTRAINT fk_user_address FOREIGN KEY (id) REFERENCES user_address(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_uploads FOREIGN KEY (profile_picture_id) REFERENCES uploads(id) ON DELETE CASCADE;



