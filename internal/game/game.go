package game

import (
	"context"

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

func NewInstance(ctx context.Context) Instance {
	return Instance{
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

func (i *Instance) HandleAction(action Action) {
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

func (i *Instance) Run() {
	for {
		select {
		case client := <-i.Register:
			i.RegisterClient(client)
		case client := <-i.Unregister:
			i.UnregisterClient(client)
		case action := <-i.Handle:
			i.HandleAction(action)
			i.BroadcastState()
		}
	}
}
