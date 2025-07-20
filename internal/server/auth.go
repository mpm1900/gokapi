package server

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"github.com/mpm1900/gokapi/internal/db"
)

type body struct {
	Email    string
	Password string
}

func handleSignUp(ctx context.Context, queries *db.Queries) http.HandlerFunc {
	logger := slog.Default()
	return func(w http.ResponseWriter, r *http.Request) {
		req, err := io.ReadAll(r.Body)
		if err != nil {
			logger.Error("Error reading request body", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()

		var body body
		if err := json.Unmarshal(req, &body); err != nil {
			logger.Error("Error unmarshalling request body", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		user, err := queries.GetUserByEmail(ctx, body.Email)
		if err != nil {
			if !errors.Is(err, sql.ErrNoRows) {
				logger.Error("Error finding user", "err", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
			if err != nil {
				logger.Error("Error generating password hash", "err", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			user, err := queries.CreateUser(ctx, db.CreateUserParams{
				Email:    body.Email,
				Password: string(hash),
			})
			fmt.Println(user.Email, user.Password)
			w.WriteHeader(http.StatusOK)
			return
		}

		fmt.Println("User already exists", user)
		w.WriteHeader(http.StatusConflict)
	}
}

func handleLogin(ctx context.Context, queries *db.Queries) http.HandlerFunc {
	logger := slog.Default()
	return func(w http.ResponseWriter, r *http.Request) {
		req, err := io.ReadAll(r.Body)
		if err != nil {
			logger.Error("Error reading request body", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		var body body
		if err := json.Unmarshal(req, &body); err != nil {
			logger.Error("Error unmarshalling request body", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		user, err := queries.GetUserByEmail(ctx, body.Email)
		if err != nil {
			logger.Error("Error finding user", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
		if err != nil {
			logger.Error("Error comparing passwords", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		cookie := http.Cookie{
			Name:     "token",
			Value:    "6940farts",
			MaxAge:   60 * 60 * 24 * 365 * 100,
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteStrictMode,
		}
		http.SetCookie(w, &cookie)
		w.WriteHeader(http.StatusOK)
	}
}
