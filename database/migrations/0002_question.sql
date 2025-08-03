-- +goose up
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  prompt text NOT NULL,
  time integer NOT NULL
);

CREATE TABLE IF NOT EXISTS question_choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(id),
  text text NOT NULL
);

-- +goose down
DROP TABLE questions;
DROP TABLE question_choices;
