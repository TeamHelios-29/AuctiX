CREATE TABLE admin_actions (
       id UUID PRIMARY KEY,
       admin_id UUID NOT NULL,
       user_id UUID NOT NULL,
       activity_type VARCHAR(255) NOT NULL,
       description TEXT,
       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (admin_id) REFERENCES admins(id),
       FOREIGN KEY (user_id) REFERENCES users(id)
);
