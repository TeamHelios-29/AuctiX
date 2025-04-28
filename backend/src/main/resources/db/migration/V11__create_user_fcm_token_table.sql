CREATE TABLE user_fcm_tokens
(
    id UUID DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    fcm_token TEXT NOT NULL,
    device_user_agent VARCHAR(100),
    created_at TIMESTAMP DEFAULT now(),
    last_used_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT pk_user_fcm_tokens PRIMARY KEY (id),
    CONSTRAINT fk_user_fcm_tokens_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_fcm_tokens_token UNIQUE (fcm_token)
);

CREATE INDEX idx_user_fcm_tokens_userid ON user_fcm_tokens(user_id);
