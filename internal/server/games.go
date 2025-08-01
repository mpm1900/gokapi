package server

import (
	"context"
	"encoding/json"
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
	gameID := uuid.New()
	defaultInstance := game.NewInstance(ctx, gameID)
	handler := &GamesHandler{
		mux: http.NewServeMux(),
		games: map[uuid.UUID]*game.Instance{
			gameID: defaultInstance,
		},
	}

	go defaultInstance.Run()

	handler.mux.HandleFunc("GET /{gameID}/connect", auth.WithJWT(handler.handleGameConnection(ctx, queries), queries))
	return handler
}

func (gh *GamesHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	gh.mux.ServeHTTP(w, r)
}

func (gh *GamesHandler) NewGameInstance(gameID uuid.UUID, ctx context.Context) *game.Instance {
	instance := game.NewInstance(ctx, gameID)
	gh.gamesMu.Lock()
	gh.games[instance.ID] = instance
	gh.gamesMu.Unlock()
	go instance.Run()

	return instance
}

func (gh *GamesHandler) GetGameInstance(gameID uuid.UUID) (*game.Instance, bool) {
	gh.gamesMu.RLock()
	defer gh.gamesMu.RUnlock()
	instance, ok := gh.games[gameID]

	return instance, ok
}

func (gh *GamesHandler) GetAllGameInstances() []game.Instance {
	gh.gamesMu.RLock()
	defer gh.gamesMu.RUnlock()
	games := make([]game.Instance, 0, len(gh.games))
	for _, instance := range gh.games {
		games = append(games, *instance)
	}
	return games
}

func (gh *GamesHandler) HandleGetGames(w http.ResponseWriter, r *http.Request) {
	games := gh.GetAllGameInstances()
	if len(games) == 0 {
		games = make([]game.Instance, 0)
	}
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(games)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
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

		instance, ok := gh.GetGameInstance(gameID)
		if !ok {
			instance = gh.NewGameInstance(gameID, ctx)
		}

		_, ok = instance.Clients[userID]
		if !ok {
			user, err := queries.GetUserByID(ctx, userID)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			role := "PLYAYER"
			if len(instance.Clients) == 0 {
				role = "HOST"
			}
			client := game.NewClient(instance, &user, role)
			if err := client.Connect(w, r); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			client.Run()
		}
	}
}
