CREATE TABLE coin_transactions (
                                   id SERIAL PRIMARY KEY,
                                   user_id UUID NOT NULL REFERENCES users(id),
                                   amount NUMERIC NOT NULL,
                                   freeze_amount NUMERIC NOT NULL DEFAULT 0,
                                   transaction_type VARCHAR(50) NOT NULL,
                                   status VARCHAR(50) NOT NULL,
                                   description TEXT,
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data (you would insert this manually or through your database tool)
-- INSERT INTO coin_transactions
-- (user_id, amount, freeze_amount, transaction_type, status, description)
-- VALUES
-- ('your-user-id-here', 500, 0, 'PURCHASE', 'PENDING', 'Initial coin purchase');
