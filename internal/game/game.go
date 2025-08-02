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
	HostID  uuid.UUID             `json:"hostID"`
	ctx     context.Context       `json:"-"`
	Clients map[uuid.UUID]*Client `json:"-"`
	State   State                 `json:"-"`

	Register   chan *Client `json:"-"`
	Unregister chan *Client `json:"-"`
	ReadAction chan Action  `json:"-"`
}

func NewInstance(ctx context.Context, id uuid.UUID) *Instance {
	return &Instance{
		ID:         id,
		ctx:        ctx,
		Clients:    make(map[uuid.UUID]*Client),
		State:      State{},
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		ReadAction: make(chan Action),
	}
}

func (i *Instance) RegisterClient(client *Client) {
	i.Clients[client.ID] = client
}

func (i *Instance) UnregisterClient(client *Client) {
	// if _, ok := i.Clients[client.ID]; ok {
	delete(i.Clients, client.ID)
	// }
}

func (i *Instance) BroadcastState() {
	state := i.State
	for _, client := range i.Clients {
		select {
		case client.nextState <- state:
		// if a client is unable to handle the state update,
		//   unregister them so they don't the loop
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
		// if a client is unable to handle the state update,
		//   unregister them so they don't the loop
		default:
			i.UnregisterClient(client)
		}
	}
}

func (i *Instance) BroadcastChatMessage(chatMessage ChatMessage) {
	for _, client := range i.Clients {
		select {
		case client.nextChatMessage <- chatMessage:
		default:
			// If the client's channel is blocked, unregister them.
			// This prevents a slow client from blocking the entire broadcast.
			i.UnregisterClient(client)
		}
	}
}

func (i *Instance) Run() {
	for {
		select {
		case client := <-i.Register:
			i.RegisterClient(client)
			i.BroadcastClients()
			i.SendState(client)
		case client := <-i.Unregister:
			i.UnregisterClient(client)
			i.BroadcastClients()
		case action := <-i.ReadAction:
			switch Reducer(i, action) {
			case state:
				i.BroadcastState()
			case clients:
				i.BroadcastClients()
			case chatMessage:
				i.BroadcastChatMessage(action.ChatMessage)
			}
		}
	}
}
