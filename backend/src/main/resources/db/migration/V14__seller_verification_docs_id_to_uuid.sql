ALTER TABLE seller_review_images DROP CONSTRAINT fk_review;
ALTER TABLE seller_review_images DROP CONSTRAINT fk_review_image;
ALTER TABLE seller_verification_reqs DROP CONSTRAINT fk_verification_docs;
ALTER TABLE seller_verification_reqs DROP CONSTRAINT fk_seller_verification;
ALTER TABLE seller_verification_docs DROP CONSTRAINT fk_verification_docs_uploads;
ALTER TABLE seller_reviews DROP CONSTRAINT fk_seller_review;


ALTER TABLE seller_reviews DROP COLUMN id;
ALTER TABLE seller_reviews ADD COLUMN id UUID PRIMARY KEY;

ALTER TABLE seller_review_images DROP COLUMN id;
ALTER TABLE seller_review_images ADD COLUMN id UUID PRIMARY KEY;
ALTER TABLE seller_review_images DROP COLUMN review_id;
ALTER TABLE seller_review_images ADD COLUMN review_id UUID NOT NULL;
ALTER TABLE seller_review_images DROP COLUMN image_ref;
ALTER TABLE seller_review_images ADD COLUMN image_ref UUID;

ALTER TABLE seller_verification_docs DROP COLUMN id;
ALTER TABLE seller_verification_docs ADD COLUMN id UUID PRIMARY KEY;
ALTER TABLE seller_verification_docs DROP COLUMN doc_ref;
ALTER TABLE seller_verification_docs ADD COLUMN doc_ref UUID;

ALTER TABLE seller_verification_reqs DROP COLUMN id;
ALTER TABLE seller_verification_reqs ADD COLUMN id UUID PRIMARY KEY;
ALTER TABLE seller_verification_reqs DROP COLUMN doc_id;
ALTER TABLE seller_verification_reqs ADD COLUMN doc_id UUID;


ALTER TABLE seller_reviews
    ADD CONSTRAINT fk_seller_review FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE;

ALTER TABLE seller_review_images
    ADD CONSTRAINT fk_review FOREIGN KEY (review_id) REFERENCES seller_reviews(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_review_image FOREIGN KEY (image_ref) REFERENCES uploads(id) ON DELETE CASCADE;

ALTER TABLE seller_verification_docs
    ADD CONSTRAINT fk_verification_docs_uploads FOREIGN KEY (doc_ref) REFERENCES uploads(id) ON DELETE CASCADE;

ALTER TABLE seller_verification_reqs
    ADD CONSTRAINT fk_seller_verification FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_verification_docs FOREIGN KEY (doc_id) REFERENCES seller_verification_docs(id) ON DELETE CASCADE;
