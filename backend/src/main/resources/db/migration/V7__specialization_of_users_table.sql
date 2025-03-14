CREATE TABLE seller (
    id UUID PRIMARY KEY,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    banner_id INT DEFAULT NULL,
    CONSTRAINT fk_seller_banner FOREIGN KEY (banner_id) REFERENCES uploads(id) ON DELETE SET NULL
);

CREATE TABLE seller_reviews (
    id SERIAL PRIMARY KEY,
    seller_id UUID NOT NULL,
    review_content VARCHAR(1024),
    rating NUMERIC CHECK (rating BETWEEN 0 AND 5) DEFAULT 0,
    review_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_seller_review FOREIGN KEY (seller_id) REFERENCES seller(id) ON DELETE CASCADE
);

CREATE TABLE seller_review_images (
    id SERIAL PRIMARY KEY,
    review_id SERIAL NOT NULL,
    image_ref SERIAL,
    CONSTRAINT fk_review FOREIGN KEY (review_id) REFERENCES seller_reviews(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_image FOREIGN KEY (image_ref) REFERENCES uploads(id) ON DELETE CASCADE
);

CREATE TABLE seller_verification_docs (
    id SERIAL PRIMARY KEY,
    doc_ref SERIAL,
    CONSTRAINT fk_verification_docs_uploads FOREIGN KEY (doc_ref) REFERENCES uploads(id) ON DELETE CASCADE
);

CREATE TABLE seller_verification_req (
    id SERIAL PRIMARY KEY,
    seller_id UUID NOT NULL,
    verification_status VARCHAR(50) NOT NULL,
    doc_id SERIAL,
    description VARCHAR(255),
    CONSTRAINT fk_seller_verification FOREIGN KEY (seller_id) REFERENCES seller(id) ON DELETE CASCADE,
    CONSTRAINT fk_verification_docs FOREIGN KEY (doc_id) REFERENCES seller_verification_docs(id) ON DELETE CASCADE
);


CREATE TABLE bidder (
    id UUID PRIMARY KEY,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE admin (
    id UUID PRIMARY KEY,
    is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE Users
    ADD CONSTRAINT fk_seller FOREIGN KEY (id) REFERENCES seller(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_bidder FOREIGN KEY (id) REFERENCES bidder(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_admin FOREIGN KEY (id) REFERENCES admin(id) ON DELETE CASCADE;



