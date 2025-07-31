package game

import (
	"context"
	"fmt"
	"maps"
	"slices"

	"github.com/google/uuid"
)

type Instance struct {
	ID      uuid.UUID `json:"id"`
	ctx     context.Context
	Clients map[uuid.UUID]*Client
	State   State

	Register   chan *Client
	Unregister chan *Client
	Handle     chan Action
}

func NewInstance(ctx context.Context) *Instance {
	return &Instance{
		ID:         uuid.New(),
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
		close(client.next)
	}
}

func (i *Instance) BroadcastState() {
	for _, client := range i.Clients {
		select {
		case client.next <- i.State:
		default:
			i.UnregisterClient(client)
		}
	}
}

func (i *Instance) BroadcastClients() {
	clients := slices.Collect(maps.Values(i.Clients))
	for _, client := range i.Clients {
		select {
		case client.updateClients <- clients:
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
			fmt.Println("registering client")
			i.RegisterClient(client)
			i.BroadcastClients()
		case client := <-i.Unregister:
			fmt.Println("unregistering client")
			i.UnregisterClient(client)
			i.BroadcastClients()
		case action := <-i.Handle:
			Reducer(i, action)
			i.BroadcastState()
		}
	}
}
