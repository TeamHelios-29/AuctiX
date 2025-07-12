ALTER TABLE users
  DROP COLUMN is_profile_complete;

CREATE TABLE user_required_actions (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   action_type VARCHAR(50) NOT NULL,
   context TEXT,
   is_resolved BOOLEAN DEFAULT FALSE,
   resolved_at TIMESTAMP,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);