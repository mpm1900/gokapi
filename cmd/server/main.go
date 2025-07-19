package main

import (
	"context"
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/mpm1900/gokapi/internal/db"
	"github.com/mpm1900/gokapi/internal/server"
)

var addr = flag.String("addr", ":8080", "http service address")

func main() {
	flag.Parse()
	logger := slog.Default()
	ctx := context.Background()

	pgdb := os.Getenv("POSTGRES_DB")
	pguser := os.Getenv("POSTGRES_USER")
	pgpass := os.Getenv("POSTGRES_PASSWORD")
	pghost := os.Getenv("POSTGRES_HOST")

	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s", pguser, pgpass, pgdb, pghost)
	pool, err := pgxpool.New(ctx, connStr)
	if err != nil {
		logger.Error("Error connecting to database", "err", err)
		os.Exit(1)
	}
	defer pool.Close()
	queries := db.New(pool)

	mux := http.NewServeMux()
	staticHandler := &server.StaticHandler{
		Path:  "./web/dist",
		Entry: "index.html",
	}

	mux.Handle("GET /", staticHandler)

	mux.HandleFunc("GET /users/{name}", func(w http.ResponseWriter, r *http.Request) {
		logger.Info("Request received", "url", r.URL.Path)
		name := r.PathValue("name")
		user, err := queries.CreateUser(ctx, name)
		if err != nil {
			logger.Error("Error creating user", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(user.Name))
	})

	server := &http.Server{
		Addr:    *addr,
		Handler: mux,
	}

	logger.Info("Starting server", "addr", *addr)
	server.ListenAndServe()
}
