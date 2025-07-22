package server

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/mpm1900/gokapi/internal/auth"
	"github.com/mpm1900/gokapi/internal/db"
)

type Server struct {
	*http.Server
}

func NewServer(ctx context.Context, queries *db.Queries, mux *http.ServeMux) *Server {
	addr := ctx.Value("addr").(string)
	logger := slog.Default()

	staticHandler, err := NewStaticHandler("./web/dist", "index.html")
	if err != nil {
		logger.Error("Error creating static handler", "err", err)
		return nil
	}

	api := http.NewServeMux()
	api.Handle("GET /auth/me", auth.WithJWT(handleMe(ctx)))
	api.Handle("POST /auth/signup", handleSignUp(ctx, queries))
	api.Handle("POST /auth/login", handleLogin(ctx, queries))
	api.Handle("POST /auth/logout", handleLogout(ctx))

	mux.Handle("/api/", http.StripPrefix("/api", api))
	mux.Handle("/", staticHandler)

	return &Server{
		Server: &http.Server{
			Addr:    addr,
			Handler: mux,
		},
	}
}
