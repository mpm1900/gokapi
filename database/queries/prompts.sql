-- name: GetPromptsByUserID :many
SELECT * FROM prompts WHERE user_id = $1;

-- name: CreatePrompt :one
INSERT INTO prompts (user_id) VALUES ($1) RETURNING *;

-- name: UpdatePrompt :one
UPDATE prompts Set editor_state = $1 WHERE id = $2 RETURNING *;

-- name: DeletePrompt :exec
DELETE FROM prompts WHERE id = $1;
