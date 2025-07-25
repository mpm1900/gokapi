// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0

package db

import (
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

type User struct {
	ID       uuid.UUID   `json:"id"`
	Email    string      `json:"email"`
	Password string      `json:"password"`
	Salt     string      `json:"salt"`
	Username pgtype.Text `json:"username"`
}
