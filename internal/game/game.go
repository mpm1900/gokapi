package game

import (
	"context"
	"fmt"
	"maps"
	"slices"

	"github.com/google/uuid"
)

type Instance struct {
	ID      uuid.UUID             `json:"id"`
	ctx     context.Context       `json:"-"`
	Clients map[uuid.UUID]*Client `json:"-"`
	State   State                 `json:"-"`

	Register   chan *Client `json:"-"`
	Unregister chan *Client `json:"-"`
	Handle     chan Action  `json:"-"`
}

func NewInstance(ctx context.Context, id uuid.UUID) *Instance {
	return &Instance{
		ID:         id,
		ctx:        ctx,
		Clients:    make(map[uuid.UUID]*Client),
		State:      State{},
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Handle:     make(chan Action),
	}
}

func (i *Instance) RegisterClient(client *Client) {
	i.Clients[client.ID] = client
}

func (i *Instance) UnregisterClient(client *Client) {
	if _, ok := i.Clients[client.ID]; ok {
		delete(i.Clients, client.ID)
	}
}

func (i *Instance) BroadcastState() {
	fmt.Println("broadcasting state")
	state := i.State
	for _, client := range i.Clients {
		select {
		case client.nextState <- state:
		default:
			i.UnregisterClient(client)
		}
	}
}

func (i *Instance) SendState(client *Client) {
	client.nextState <- i.State
}

func (i *Instance) BroadcastClients() {
	clients := slices.Collect(maps.Values(i.Clients))
	for _, client := range i.Clients {
		select {
		case client.nextClients <- clients:
		default:
			i.UnregisterClient(client)
		}
	}
}

func (i *Instance) Run() {
	fmt.Println("running game instance")
	for {
		select {
		case client := <-i.Register:
			fmt.Println("registering client", client.ID)
			i.RegisterClient(client)
			i.BroadcastClients()
			i.SendState(client)
		case client := <-i.Unregister:
			fmt.Println("unregistering client", client.ID)
			i.UnregisterClient(client)
			i.BroadcastClients()
		case action := <-i.Handle:
			if Reducer(i, action) {
				i.BroadcastState()
			}
		}
	}
}
