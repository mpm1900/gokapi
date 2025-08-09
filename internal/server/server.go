package server

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"

	"github.com/mpm1900/gokapi/internal/auth"
	"github.com/mpm1900/gokapi/internal/db"
)

type Server struct {
	*http.Server
	logger *slog.Logger
}

func NewServer(ctx context.Context, queries *db.Queries) *Server {
	addr := os.Getenv("PORT")
	logger := slog.Default()

	staticHandler, err := NewStaticHandler("./web/dist", "index.html")
	if err != nil {
		logger.Error("Error creating static handler", "err", err)
		return nil
	}

	store := auth.NewStore()
	gamesHandler := NewGamesHandler(ctx, queries, store)

	mux := http.NewServeMux()
	api := http.NewServeMux()
	api.Handle("GET  /auth/me", auth.WithJWT(handleMe(ctx), store))
	api.Handle("POST /auth/signup", handleSignUp(ctx, queries, store))
	api.Handle("POST /auth/login", handleLogin(ctx, queries, store))
	api.Handle("POST /auth/logout", auth.WithJWT(handleLogout(ctx, queries, store), store))
	api.Handle("GET /games", auth.WithJWT(gamesHandler.HandleGetGames, store))
	api.Handle("POST /user/{userID}/username", auth.WithJWT(handleUpdateUsername(ctx, queries), store))

	mux.Handle("/api/", http.StripPrefix("/api", api))
	mux.Handle("/games/", http.StripPrefix("/games", gamesHandler))
	mux.Handle("/", staticHandler)

	return &Server{
		Server: &http.Server{
			Addr:    addr,
			Handler: mux,
		},
		logger: logger,
	}
}

func (s *Server) Run() error {
	certFile := os.Getenv("CERT_FILE")
	keyFile := os.Getenv("KEY_FILE")

	if certFile == "" || keyFile == "" {
		return errors.New("HTTPS is not supported. Please add CERT_FILE and KEY_FILE to your .env file")
	}
	err := s.ListenAndServeTLS(certFile, keyFile)
	if err != nil && err != http.ErrServerClosed {
		return err
	}
	return nil
}
