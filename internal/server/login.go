package server

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"

	"github.com/golang-jwt/jwt/v5"

	"github.com/mpm1900/gokapi/internal/auth"
	"github.com/mpm1900/gokapi/internal/db"
)

type body struct {
	Email    string
	Password string
}

func getAuthBody(r *http.Request) (*body, error) {
	req, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, err
	}
	defer r.Body.Close()

	var body body
	if err := json.Unmarshal(req, &body); err != nil {
		return nil, err
	}

	return &body, nil
}

func getAuthUser(ctx context.Context, queries *db.Queries, body *body) (*db.User, bool, error) {
	user, err := queries.GetUserByEmail(ctx, body.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, false, nil
		}

		return nil, false, err
	}

	return &user, true, err
}

func createAuthUser(ctx context.Context, queries *db.Queries, email, password string) (*db.User, error) {
	hashed, salt, err := auth.HashPassword(password)
	if err != nil {
		return nil, err
	}
	user, err := queries.CreateUser(ctx, db.CreateUserParams{
		Email:    email,
		Password: hashed,
		Salt:     salt,
	})
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// POST /auth/signup
func handleSignUp(ctx context.Context, queries *db.Queries) http.HandlerFunc {
	logger := slog.Default()
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := getAuthBody(r)

		if err != nil {
			logger.Error("Error getting auth body", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		user, ok, err := getAuthUser(ctx, queries, body)
		if err != nil {
			logger.Error("Error finding user", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if ok {
			logger.Error("User already exists", "user", user.Email)
			w.WriteHeader(http.StatusConflict)
			return
		}
		dbuser, err := createAuthUser(ctx, queries, body.Email, body.Password)
		if err != nil {
			logger.Error("Error creating user", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		cookie, err := auth.CreateJWTCookie(dbuser)
		if err != nil {
			logger.Error("Error creating JWT", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		http.SetCookie(w, cookie)
		w.WriteHeader(http.StatusOK)
	}
}

// POST /auth/login
func handleLogin(ctx context.Context, queries *db.Queries) http.HandlerFunc {
	logger := slog.Default()
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := getAuthBody(r)
		if err != nil {
			logger.Error("Error getting auth body", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		user, ok, err := getAuthUser(ctx, queries, body)
		if !ok || err != nil {
			logger.Error("Error finding user", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = auth.CheckPasswords(body.Password, user.Password, user.Salt)
		if err != nil {
			logger.Error("Error comparing passwords", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		cookie, err := auth.CreateJWTCookie(user)
		if err != nil {
			logger.Error("Error creating JWT", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		http.SetCookie(w, cookie)
		w.WriteHeader(http.StatusOK)
	}
}

// POST /auth/logout
func handleLogout(ctx context.Context) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{
			Name:     "jwt",
			Value:    "",
			MaxAge:   -1,
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteStrictMode,
		})
		w.WriteHeader(http.StatusOK)
	}
}

// GET /auth/m
func handleMe(ctx context.Context) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwt := r.Context().Value("jwt").(jwt.MapClaims)
		cookie, err := auth.RefreshJWT(jwt)
		if err != nil {
			slog.Default().Error("Error refreshing JWT", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		http.SetCookie(w, cookie)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(jwt)
	}
}
