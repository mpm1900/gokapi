package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	"github.com/mpm1900/gokapi/internal/auth"
	"github.com/mpm1900/gokapi/internal/db"
	"github.com/mpm1900/gokapi/internal/game"
)

type GamesHandler struct {
	mux      *http.ServeMux
	games    map[uuid.UUID]*game.Instance
	register chan *game.Instance
}

func NewGamesHandler(ctx context.Context, queries *db.Queries) *GamesHandler {
	handler := &GamesHandler{
		mux:      http.NewServeMux(),
		games:    make(map[uuid.UUID]*game.Instance),
		register: make(chan *game.Instance),
	}

	handler.mux.HandleFunc("GET /{gameID}/connect", auth.WithJWT(handler.handleGameConnection(ctx, queries), queries))
	return handler
}

func (gh *GamesHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	gh.mux.ServeHTTP(w, r)
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

		instance, ok := gh.games[gameID]
		if !ok {
			instance = game.NewInstance(ctx)
			instance.ID = gameID
			gh.register <- instance
		}

		client := game.NewClient(instance, &user)
		if err := client.Connect(w, r); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		fmt.Println(len(gh.games), len(instance.Clients))
		client.Run()
	}
}

func (gh *GamesHandler) Run() {
	for {
		select {
		case instance := <-gh.register:
			gh.games[instance.ID] = instance
			go instance.Run()
		}
	}
}
