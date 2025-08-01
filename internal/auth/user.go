package auth

import (
	"context"
	"database/sql"
	"errors"

	"github.com/mpm1900/gokapi/internal/db"
)

func GetUser(ctx context.Context, queries *db.Queries, email string) (*db.User, bool, error) {
	user, err := queries.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, false, nil
		}

		return nil, false, err
	}

	return &user, true, err
}

func CreateUser(ctx context.Context, queries *db.Queries, email, password string) (*db.User, error) {
	hashed, salt, err := HashPassword(password)
	if err != nil {
		return nil, err
	}
	user, err := queries.CreateUser(ctx, db.CreateUserParams{
		Email:    email,
		Password: hashed,
		Salt:     salt,
		Username: email,
	})
	if err != nil {
		return nil, err
	}
	return &user, nil
}
