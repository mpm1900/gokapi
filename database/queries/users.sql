-- name: GetUsers :many
SELECT * FROM users;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserJwtVersion :one
SELECT jwt_version FROM users WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: CreateUser :one
INSERT INTO users (email, password, salt, username) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: LogOutUser :exec
UPDATE users SET jwt_version = jwt_version + 1 WHERE id = $1;
