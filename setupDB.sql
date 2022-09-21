psql -U postgres

CREATE DATABASE killer;

\c killer

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    account_type VARCHAR(255) NOT NULL,
    task_completion INTEGER DEFAULT 0
    -- skills_id INTEGER,
);
CREATE TABLE target_list (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nationality VARCHAR(255),
    age INTEGER,
    company VARCHAR(255),
    living_district VARCHAR(255),
    remarks VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    bounty INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(255) DEFAULT 'pending',
    description VARCHAR(255),
    evidence VARCHAR(255),
    target_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    FOREIGN KEY (target_id) REFERENCES target_list(id),
    FOREIGN KEY (client_id) REFERENCES users(id)
    -- expiration TIMESTAMP NOT NULL,
    -- liked INTEGER NOT NULL,
);


CREATE TABLE kill_count (
    id SERIAL PRIMARY KEY,
    count INTEGER NOT NULL
);

CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    target_id INTEGER NOT NULL,
    photo VARCHAR(255) NOT NULL, 
    FOREIGN KEY (target_id) REFERENCES target_list(id)
);

CREATE TABLE referral (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    killer_id INTEGER NOT NULL,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (killer_id) REFERENCES users(id)
);

CREATE TABLE evidence (
    id SERIAL PRIMARY KEY,
    photo VARCHAR(255) NOT NULL,
    order_id INTEGER NOT NULL,
    killer_id INTEGER NOT NULL,
    FOREIGN KEY (killer_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- NOT USING / FOR FUTURE USES
-- CREATE TABLE skills (
--     id SERIAL PRIMARY KEY,
--     skills VARCHAR(255) NOT NULL
-- );

-- NOT USING / FOR FUTURE USES
-- CREATE TABLE killer_advertisements (
--     id SERIAL PRIMARY KEY,
--     killer_id INTEGER NOT NULL,
--     content TEXT NOT NULL,
--     status VARCHAR(255) NOT NULL,
-- );