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
	addr := ctx.Value("addr").(*string)
	logger := slog.Default()
	logger.Info("Creating server", "addr", *addr)

	staticHandler, err := NewStaticHandler("./web/dist", "index.html")
	if err != nil {
		logger.Error("Error creating static handler", "err", err)
		return nil
	}

	mux.Handle("GET /", staticHandler)

	mux.HandleFunc("GET /users/{name}", func(w http.ResponseWriter, r *http.Request) {
		// logger.Info("Request received", "url", r.URL.Path)
		name := r.PathValue("name")
		user, err := queries.CreateUser(ctx, name)
		if err != nil {
			// logger.Error("Error creating user", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(user.Name))
	})

	return &Server{
		Server: &http.Server{
			Addr:    *addr,
			Handler: mux,
		},
	}
}
