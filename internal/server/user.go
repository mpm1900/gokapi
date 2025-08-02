package server

import (
	"context"
	"net/http"

	"github.com/golang-jwt/jwt/v5"

	"github.com/mpm1900/gokapi/internal/auth"
	"github.com/mpm1900/gokapi/internal/db"
)

func handleUpdateUsername(ctx context.Context, queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwt := r.Context().Value("userID").(jwt.MapClaims)
		userID, err := auth.GetUUIDFromJWTClaims(jwt)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if userID.String() != r.PathValue("userID") {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
