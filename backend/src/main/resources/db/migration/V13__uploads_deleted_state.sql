ALTER TABLE uploads
    ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE uploads
    RENAME COLUMN url TO file_id;

ALTER TABLE uploads
    ADD COLUMN category VARCHAR(50) DEFAULT 'Unknown';
