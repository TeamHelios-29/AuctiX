
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY,
    country VARCHAR(50),
    address_number VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    CONSTRAINT fk_user_address FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE user_profile_photos
(
    id UUID PRIMARY KEY,
    photo_ref SERIAL,
    CONSTRAINT fk_user_profile_photo FOREIGN KEY (id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_profile_photos_uploads FOREIGN KEY (photo_ref) REFERENCES uploads(id) ON DELETE CASCADE
);


