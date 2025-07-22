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

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

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
		if !errors.Is(err, sql.ErrNoRows) {
			return nil, false, nil
		}

		return nil, false, err
	}

	return &user, true, err
}

func createAuthUser(ctx context.Context, queries *db.Queries, body *body) (*db.User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user, err := queries.CreateUser(ctx, db.CreateUserParams{
		Email:    body.Email,
		Password: string(hash),
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
			fmt.Println("User already exists", user)
			w.WriteHeader(http.StatusConflict)
			return
		}

		dbuser, err := createAuthUser(ctx, queries, body)
		if err != nil {
			logger.Error("Error creating user", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		fmt.Println(dbuser.Email, dbuser.Password)
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

		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
		if err != nil {
			logger.Error("Error comparing passwords", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		token, err := auth.CreateJWT(user)
		if err != nil {
			logger.Error("Error creating JWT", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		newJWT := http.Cookie{
			Name:     "jwt",
			Value:    token,
			MaxAge:   60 * 60 * 24 * 365 * 100,
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteStrictMode,
		}
		http.SetCookie(w, &newJWT)
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
		fmt.Println("ME", r)
		jwt := r.Context().Value("jwt").(jwt.MapClaims)
		fmt.Println("SUCCESS:", jwt)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(jwt)
	}
}
