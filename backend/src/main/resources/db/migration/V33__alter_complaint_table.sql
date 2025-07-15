ALTER TABLE complaints
    RENAME COLUMN reported_user_id TO target_id;

ALTER TABLE complaints
    ADD COLUMN target_type VARCHAR(100);

ALTER TABLE complaints
    ADD COLUMN description VARCHAR(1500);

ALTER TABLE complaints
    DROP CONSTRAINT IF EXISTS complaints_reported_user_id_fkey;