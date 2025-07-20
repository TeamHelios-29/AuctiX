ALTER TABLE seller_verification_docs
    DROP CONSTRAINT fk_verification_docs_uploads;

ALTER TABLE seller_verification_reqs
    DROP CONSTRAINT fk_verification_docs;

DROP TABLE seller_verification_docs;

ALTER TABLE seller_verification_reqs
    ADD CONSTRAINT fk_doc
        FOREIGN KEY (doc_id) REFERENCES uploads(id);
