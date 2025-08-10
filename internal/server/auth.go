package server

import (
	"context"
	"encoding/json"
	"fmt"
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
func handleSignUp(ctx context.Context, queries *db.Queries, store *auth.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := getAuthBody(r)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		_, ok, err := auth.GetUser(ctx, queries, body.Email)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if ok {
			w.WriteHeader(http.StatusConflict)
			return
		}
		dbuser, err := auth.CreateUser(ctx, queries, body.Email, body.Password)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		store.Set(dbuser.ID.String(), fmt.Sprintf("%d", dbuser.JwtVersion))
		cookie, err := auth.CreateJWTCookie(dbuser)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		jwt, err := auth.ParseJWT(cookie.Value)
		if err != nil {
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
func handleLogin(ctx context.Context, queries *db.Queries, store *auth.Store) http.HandlerFunc {
	logger := slog.Default()
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := getAuthBody(r)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		user, ok, err := auth.GetUser(ctx, queries, body.Email)
		if !ok || err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err = auth.CheckPasswords(body.Password, user.Password, user.Salt)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		cookie, err := auth.CreateJWTCookie(user)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		logger.Info("User logged in", "user", user.Email)
		store.Set(user.ID.String(), fmt.Sprintf("%d", user.JwtVersion))
		jwt, err := auth.ParseJWT(cookie.Value)
		if err != nil {
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
func handleLogout(ctx context.Context, queries *db.Queries, store *auth.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwt := r.Context().Value("jwt").(jwt.MapClaims)

		id, err := auth.GetUUIDFromJWTClaims(jwt)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		queries.LogOutUser(ctx, id)
		store.Delete(id.String())
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
func handleMe() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwt := r.Context().Value("jwt").(jwt.MapClaims)
		cookie, err := auth.RefreshJWT(jwt)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		http.SetCookie(w, cookie)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(jwt)
	}
}
