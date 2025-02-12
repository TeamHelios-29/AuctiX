-- CREATE TABLE User_roles
-- (
--     id SERIAL PRIMARY KEY,
--     role_name VARCHAR(50) NOT NULL
-- );

-- ALTER TABLE Users
--     ADD COLUMN first_name VARCHAR(255),
--     ADD COLUMN last_name VARCHAR(255),
--     ADD COLUMN role_id INT NOT NULL DEFAULT 1,
--     ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES User_roles(id);

-- INSERT INTO User_roles (role_name) VALUES ('buyer'),('seller'),('admin'),('super admin');
