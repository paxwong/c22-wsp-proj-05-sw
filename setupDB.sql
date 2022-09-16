psql -U postgres

CREATE DATABASE killer;

\c killer

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    account_type VARCHAR(255) NOT NULL,
    skills_id INTEGER,
    task_completion INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    bounty INTEGER NOT NULL,
    expiration TIMESTAMP NOT NULL,
    target_id INTEGER NOT NULL,
    liked INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'pending',
    description VARCHAR(255),
    evidence VARCHAR(255),
    client_id INTEGER NOT NULL,
    FOREIGN KEY (target_id) REFERENCES target_list(id),
    FOREIGN KEY (client_id) REFERENCES users(id)
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
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    target_id INTEGER NOT NULL,
    photo TIMESTAMP NOT NULL,
    FOREIGN KEY (target_id) REFERENCES target_list(id)
);

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    skills VARCHAR(255) NOT NULL
);

CREATE TABLE killer_advertisements (
    id SERIAL PRIMARY KEY,
    killer_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(255) NOT NULL,
);

CREATE TABLE referral (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    killer_id INTEGER NOT NULL,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (killer_id) REFERENCES users(id)
);

CREATE TABLE kill_count (
    id SERIAL PRIMARY KEY,
    count INTEGER NOT NULL
);