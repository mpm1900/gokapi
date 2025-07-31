package server

import (
	"context"
	"net/http"

	"github.com/golang-jwt/jwt/v5"

	"github.com/mpm1900/gokapi/internal/db"
	"github.com/mpm1900/gokapi/internal/game"
)

func handleGameConnection(ctx context.Context, queries *db.Queries, instance *game.Instance) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwt := ctx.Value("jwt").(jwt.MapClaims)
		user, err := queries.GetUserByEmail(ctx, jwt["email"].(string))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		client := game.NewClient(instance, &user)
		if err := client.Connect(w, r); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
