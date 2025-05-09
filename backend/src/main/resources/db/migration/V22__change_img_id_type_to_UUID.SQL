Alter Table auction_image_paths
    Drop Column image_paths,
    ADD COLUMN image_id UUID NOT NULL;