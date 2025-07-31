package game

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"slices"
	"strings"
	"time"

	"github.com/mpm1900/gokapi/internal/db"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const WriteWait = 10 * time.Second
const PongWait = 60 * time.Second
const PingPeriod = (PongWait * 9) / 10
const MaxMessageSize = 512

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		allowedOrigins := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")
		origin := r.Header.Get("Origin")
		return slices.Contains(allowedOrigins, origin)
	},
}

type Client struct {
	ID          uuid.UUID `json:"id"`
	User        *db.User  `json:"user"`
	conn        *websocket.Conn
	ctx         context.Context
	cancel      context.CancelFunc
	game        *Instance
	nextState   chan State
	nextClients chan []*Client
}

func NewClient(game *Instance, user *db.User) *Client {
	ctx, cancel := context.WithCancel(game.ctx)
	return &Client{
		ID:          user.ID,
		ctx:         ctx,
		cancel:      cancel,
		game:        game,
		nextState:   make(chan State),
		nextClients: make(chan []*Client),
		User:        user,
	}
}

func (c *Client) Connect(w http.ResponseWriter, r *http.Request) error {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return err
	}

	c.conn = conn
	c.game.Register <- c
	return nil
}

func (c *Client) WriteState(state State) error {
	json, err := json.Marshal(NewStateMessage(state))
	if err != nil {
		return err
	}
	if err = c.conn.WriteMessage(websocket.TextMessage, json); err != nil {
		return err
	}

	return nil
}

func (c *Client) WriteClients(clients []*Client) error {
	json, err := json.Marshal(NewClientsMessage(clients))
	if err != nil {
		return err
	}

	if err = c.conn.WriteMessage(websocket.TextMessage, json); err != nil {
		return err
	}

	return nil
}

func (c *Client) listenForAction(action *Action) error {
	_, raw, err := c.conn.ReadMessage()
	if err != nil {
		return err
	}
	if err := json.Unmarshal(raw, action); err != nil {
		return err
	}
	return nil
}

func (c *Client) listenIn() {
	defer func() {
		c.game.Unregister <- c
		c.conn.Close()
		c.cancel()
	}()

	pongHandler := func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(PongWait))
		return nil
	}
	c.conn.SetReadLimit(MaxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(PongWait))
	c.conn.SetPongHandler(pongHandler)

	for {
		var action Action
		if err := c.listenForAction(&action); err != nil {
			// if this error is an expected close error
			// or a message format error,
			//    then we can close the client
			break
		}

		fmt.Println("received action", action)
		select {
		case c.game.Handle <- action:
		case <-c.ctx.Done():
			return
		}
	}
}

func (c *Client) listenOut() {
	clock := time.NewTicker(PingPeriod)
	defer func() {
		clock.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case state := <-c.nextState:
			fmt.Println("writing state", state)
			c.conn.SetWriteDeadline(time.Now().Add(WriteWait))
			if err := c.WriteState(state); err != nil {
				return
			}
		case clients := <-c.nextClients:
			fmt.Println("writing clients", len(clients))
			c.conn.SetWriteDeadline(time.Now().Add(WriteWait))
			if err := c.WriteClients(clients); err != nil {
				return
			}
		// this block ensures that the client doesnt' get disconnected
		// automatically when the connection is idle
		case <-clock.C:
			c.conn.SetWriteDeadline(time.Now().Add(WriteWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		case <-c.ctx.Done():
			return
		}
	}
}

func (c *Client) Run() {
	go c.listenIn()
	go c.listenOut()
}
