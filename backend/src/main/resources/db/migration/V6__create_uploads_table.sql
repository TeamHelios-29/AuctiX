CREATE TABLE uploads (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255),
    is_public BOOLEAN DEFAULT FALSE,
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_size BIGINT,
    hash_256 VARCHAR(64),
    owner_id UUID NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_uploads_owner_id FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE SET NULL
);


