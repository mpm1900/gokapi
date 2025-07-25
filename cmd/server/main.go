package main

import (
	"context"
	"log/slog"
	"os"

	"github.com/mpm1900/gokapi/internal/db"
	"github.com/mpm1900/gokapi/internal/server"
)

func main() {
	logger := slog.Default()
	ctx := context.Background()

	pool, err := db.Connect(ctx)
	if err != nil {
		logger.Error("Error connecting to database", "err", err)
		os.Exit(1)
	}
	defer pool.Close()
	queries := db.New(pool)

	s := server.NewServer(ctx, queries)
	err = s.Run()
	if err != nil {
		logger.Error("Error running server", "err", err)
		os.Exit(1)
	}
}

