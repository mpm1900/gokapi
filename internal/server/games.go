package server

import (
	"context"
	"net/http"
	"sync"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	"github.com/mpm1900/gokapi/internal/auth"
	"github.com/mpm1900/gokapi/internal/db"
	"github.com/mpm1900/gokapi/internal/game"
)

type GamesHandler struct {
	mux     *http.ServeMux
	games   map[uuid.UUID]*game.Instance
	gamesMu sync.RWMutex
}

func NewGamesHandler(ctx context.Context, queries *db.Queries) *GamesHandler {
	handler := &GamesHandler{
		mux:   http.NewServeMux(),
		games: make(map[uuid.UUID]*game.Instance),
	}

	handler.mux.HandleFunc("GET /{gameID}/connect", auth.WithJWT(handler.handleGameConnection(ctx, queries), queries))
	return handler
}

func (gh *GamesHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	gh.mux.ServeHTTP(w, r)
}

func (gh *GamesHandler) newGameInstance(gameID uuid.UUID, ctx context.Context) *game.Instance {
	instance := game.NewInstance(ctx)
	instance.ID = gameID
	gh.gamesMu.Lock()
	gh.games[instance.ID] = instance
	gh.gamesMu.Unlock()
	go instance.Run()

	return instance
}

func (gh *GamesHandler) handleGameConnection(ctx context.Context, queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		jwt := r.Context().Value("jwt").(jwt.MapClaims)
		gameID, err := uuid.Parse(r.PathValue("gameID"))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		userID, err := uuid.Parse(jwt["id"].(string))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		user, err := queries.GetUserByID(ctx, userID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		gh.gamesMu.RLock()
		instance, ok := gh.games[gameID]
		gh.gamesMu.RUnlock()
		if !ok {
			instance = gh.newGameInstance(gameID, ctx)
		}

		client := game.NewClient(instance, &user)
		if err := client.Connect(w, r); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		client.Run()
	}
}

