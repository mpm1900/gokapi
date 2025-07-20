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

func main() {
	flag.Parse()
	logger := slog.Default()
	ctx := context.Background()

	certFile := os.Getenv("CERT_FILE")
	keyFile := os.Getenv("KEY_FILE")
	pgdb := os.Getenv("POSTGRES_DB")
	pguser := os.Getenv("POSTGRES_USER")
	pgpass := os.Getenv("POSTGRES_PASSWORD")
	pghost := os.Getenv("POSTGRES_HOST")

	addr := ":8443"
	if certFile == "" || keyFile == "" {
		logger.Error("Both CERT_FILE and KEY_FILE are not set, HTTPS is not supported")
		os.Exit(1)
	}
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s", pguser, pgpass, pgdb, pghost)
	pool, err := pgxpool.New(ctx, connStr)
	if err != nil {
		logger.Error("Error connecting to database", "err", err)
		os.Exit(1)
	}
	defer pool.Close()
	queries := db.New(pool)

	mux := http.NewServeMux()
	s := server.NewServer(context.WithValue(ctx, "addr", addr), queries, mux)

	logger.Info("Starting HTTPS server", "addr", addr)
	err = s.ListenAndServeTLS(certFile, keyFile)

	if err != nil && err != http.ErrServerClosed {
		logger.Error("Server failed", "err", err)
		os.Exit(1)
	}
}
