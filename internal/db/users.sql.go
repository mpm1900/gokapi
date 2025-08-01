// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: users.sql

package db

import (
	"context"

	"github.com/google/uuid"
)

const createUser = `-- name: CreateUser :one
INSERT INTO users (email, password, salt, username) VALUES ($1, $2, $3, $4) RETURNING id, username, email, password, salt, jwt_version
`

type CreateUserParams struct {
	Email    string `json:"email"`
	Password string `json:"-"`
	Salt     string `json:"-"`
	Username string `json:"username"`
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRow(ctx, createUser,
		arg.Email,
		arg.Password,
		arg.Salt,
		arg.Username,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.Email,
		&i.Password,
		&i.Salt,
		&i.JwtVersion,
	)
	return i, err
}

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, username, email, password, salt, jwt_version FROM users WHERE email = $1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRow(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.Email,
		&i.Password,
		&i.Salt,
		&i.JwtVersion,
	)
	return i, err
}

const getUserByID = `-- name: GetUserByID :one
SELECT id, username, email, password, salt, jwt_version FROM users WHERE id = $1
`

func (q *Queries) GetUserByID(ctx context.Context, id uuid.UUID) (User, error) {
	row := q.db.QueryRow(ctx, getUserByID, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.Email,
		&i.Password,
		&i.Salt,
		&i.JwtVersion,
	)
	return i, err
}

const getUserJwtVersion = `-- name: GetUserJwtVersion :one
SELECT jwt_version FROM users WHERE id = $1
`

func (q *Queries) GetUserJwtVersion(ctx context.Context, id uuid.UUID) (int32, error) {
	row := q.db.QueryRow(ctx, getUserJwtVersion, id)
	var jwt_version int32
	err := row.Scan(&jwt_version)
	return jwt_version, err
}

const getUsers = `-- name: GetUsers :many
SELECT id, username, email, password, salt, jwt_version FROM users
`

func (q *Queries) GetUsers(ctx context.Context) ([]User, error) {
	rows, err := q.db.Query(ctx, getUsers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []User{}
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.Username,
			&i.Email,
			&i.Password,
			&i.Salt,
			&i.JwtVersion,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const logOutUser = `-- name: LogOutUser :exec
UPDATE users SET jwt_version = jwt_version + 1 WHERE id = $1
`

func (q *Queries) LogOutUser(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.Exec(ctx, logOutUser, id)
	return err
}
