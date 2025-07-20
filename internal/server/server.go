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

	mux.HandleFunc("GET /users/{name}", func(w http.ResponseWriter, r *http.Request) {
		name := r.PathValue("name")
		user, err := queries.CreateUser(ctx, name)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(user.Name))
	})

	return &Server{
		Server: &http.Server{
			Addr:    addr,
			Handler: mux,
		},
	}
}
