package server

import (
	"context"
	"encoding/json"
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

		user, ok, err := auth.GetUser(ctx, queries, body.Email)
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
		dbuser, err := auth.CreateUser(ctx, queries, body.Email, body.Password)
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
		jwt, err := auth.ParseJWT(cookie.Value)
		if err != nil {
			logger.Error("Error parsing JWT", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		http.SetCookie(w, cookie)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(jwt)
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

		user, ok, err := auth.GetUser(ctx, queries, body.Email)
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

		logger.Info("User logged in", "user", user.Email)
		jwt, err := auth.ParseJWT(cookie.Value)
		if err != nil {
			logger.Error("Error parsing JWT", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		http.SetCookie(w, cookie)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(jwt)
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
