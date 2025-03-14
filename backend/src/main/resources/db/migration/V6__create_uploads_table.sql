CREATE TABLE uploads (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255),
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_size BIGINT,
    hash_256 VARCHAR(64),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


