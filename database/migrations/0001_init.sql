-- +goose up
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    jwt_version INTEGER NOT NULL DEFAULT 1
);

-- +goose down
DROP EXTENSION IF EXISTS "pgcrypto";

DROP TABLE users;
