Alter Table uploads
    Drop Column file_id,
    ADD COLUMN file_id UUID DEFAULT gen_random_uuid() NOT NULL;