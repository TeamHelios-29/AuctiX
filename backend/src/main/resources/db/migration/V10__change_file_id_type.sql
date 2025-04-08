ALTER TABLE seller_verification_docs DROP CONSTRAINT IF EXISTS fk_verification_docs_uploads;
ALTER TABLE seller_review_images DROP CONSTRAINT IF EXISTS fk_review_image;
ALTER TABLE sellers DROP CONSTRAINT IF EXISTS fk_seller_banner;
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_profile_photo;
ALTER TABLE uploads DROP CONSTRAINT IF EXISTS uploads_pkey;

ALTER TABLE uploads DROP COLUMN id;
ALTER TABLE uploads ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid();

ALTER TABLE seller_verification_docs DROP COLUMN IF EXISTS doc_ref;
ALTER TABLE seller_verification_docs ADD COLUMN doc_ref UUID;

ALTER TABLE seller_review_images DROP COLUMN IF EXISTS image_ref;
ALTER TABLE seller_review_images ADD COLUMN image_ref UUID;

ALTER TABLE sellers DROP COLUMN IF EXISTS banner_id;
ALTER TABLE sellers ADD COLUMN banner_id UUID;

ALTER TABLE users DROP COLUMN IF EXISTS profile_photo_id;
ALTER TABLE users ADD COLUMN profile_photo_id UUID;

ALTER TABLE seller_verification_docs
    ADD CONSTRAINT fk_verification_docs_uploads FOREIGN KEY (doc_ref) REFERENCES uploads(id) ON DELETE CASCADE;

ALTER TABLE seller_review_images
    ADD CONSTRAINT fk_review_image FOREIGN KEY (image_ref) REFERENCES uploads(id) ON DELETE CASCADE;

ALTER TABLE sellers
    ADD CONSTRAINT fk_seller_banner FOREIGN KEY (banner_id) REFERENCES uploads(id) ON DELETE SET NULL;

ALTER TABLE users
    ADD CONSTRAINT fk_profile_photo FOREIGN KEY (profile_photo_id) REFERENCES uploads(id) ON DELETE SET NULL;