package db

import (
	"context"
	"fmt"
	"log/slog"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Connect(ctx context.Context) (*pgxpool.Pool, error) {
	logger := slog.Default()

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

	return pool, nil
}
