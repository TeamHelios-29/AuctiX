CREATE TABLE notification_global_preferences (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settings JSONB NOT NULL
);

CREATE TABLE notification_event_preferences (
    user_id UUID NOT NULL,
    notification_event_type VARCHAR(50) NOT NULL,
    settings JSONB NOT NULL,
    PRIMARY KEY (user_id, notification_event_type)
);

CREATE INDEX idx_event_prefs_user_event ON notification_event_preferences(user_id, notification_event_type);