CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- https://www.postgresql.org/docs/17/functions-uuid.html
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_event TEXT,
    notification_type VARCHAR(50),
    notification_category VARCHAR(50),
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);
