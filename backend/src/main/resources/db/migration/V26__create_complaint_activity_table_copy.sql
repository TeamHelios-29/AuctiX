CREATE TABLE complaint_activity (
    id UUID PRIMARY KEY,
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    messages TEXT,
    performed_by VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_complaint_activity_complaint_id ON complaint_activity(complaint_id);
CREATE INDEX idx_complaint_activity_timestamp ON complaint_activity(timestamp DESC);
