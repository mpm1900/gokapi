package server

import (
	"context"
	"fmt"
	"io"
	"net/http"

	"github.com/mpm1900/gokapi/internal/db"
)

func handleSignUp(ctx context.Context, queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()

		fmt.Println(string(body))
		w.WriteHeader(http.StatusOK)
	}
}
