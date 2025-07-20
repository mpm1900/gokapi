package server

import (
	"context"
	"log/slog"
	"net/http"

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

	mux.Handle("POST /auth/signup", handleSignUp(ctx, queries))
	mux.Handle("GET /", staticHandler)

	return &Server{
		Server: &http.Server{
			Addr:    addr,
			Handler: mux,
		},
	}
}
