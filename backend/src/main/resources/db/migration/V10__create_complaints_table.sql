CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_user_id UUID NOT NULL,
    reported_by_id UUID NOT NULL,
    reason VARCHAR(1000) NOT NULL,
    date_reported DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (reported_user_id) REFERENCES users(id),
    FOREIGN KEY (reported_by_id) REFERENCES users(id) ON DELETE CASCADE
);