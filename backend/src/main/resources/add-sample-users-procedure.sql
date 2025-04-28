drop procedure if exists public.create_random_users(text, integer);
CREATE OR REPLACE PROCEDURE create_random_users(role_str TEXT, count INTEGER)
    LANGUAGE plpgsql
AS $$
DECLARE
    i INT;
    uid UUID;
    uname TEXT;
    fname TEXT;
    lname TEXT;
    mail TEXT;
    role_id INT;
BEGIN
    -- Map role name to role_id
    SELECT id INTO role_id FROM user_roles WHERE role_name = UPPER(role_str);

    IF role_id IS NULL THEN
        RAISE EXCEPTION 'Invalid role name: %', role_str;
    END IF;

    FOR i IN 1..count LOOP
            uid := gen_random_uuid();
            fname := INITCAP(SUBSTRING(md5(random()::text), 1, 6));
            lname := INITCAP(SUBSTRING(md5(random()::text), 1, 6));
            uname := LOWER(fname || '_' || lname || '_' || floor(random() * 10000)::int);
            mail := uname || '@example.com';

            INSERT INTO users (id, username, email, password_hash, first_name, last_name, role_id)
            VALUES (uid, uname, mail, 'password123', fname, lname, role_id);

            IF role_id = 2 THEN -- ADMIN
                INSERT INTO admins (id, is_active) VALUES (uid, true);
            ELSIF role_id = 3 THEN -- BIDDER
                INSERT INTO bidders (id, is_active) VALUES (uid, true);
            ELSIF role_id = 4 THEN -- SELLER
                INSERT INTO sellers (id, is_verified, is_active) VALUES (uid, false, true);
            END IF;
        END LOOP;
END;
$$;

CALL create_random_users('BIDDER', 80); -- create 80 random users with BIDDER role
CALL create_random_users('SELLER', 50); -- create 50 random users with SELLER role
CALL create_random_users('ADMIN', 10);  -- create 10 random users with ADMIN role