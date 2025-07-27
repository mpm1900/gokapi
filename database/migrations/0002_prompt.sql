-- +goose up
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE prompts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id),
    editor_state text NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- +goose down
DROP EXTENSION IF EXISTS "pgcrypto";

DROP TABLE prompts;
