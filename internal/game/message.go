package game

type Message struct {
	Type        string       `json:"type"`
	State       *ClientState `json:"state"`
	Clients     []*Client    `json:"clients"`
	ChatMessage *ChatMessage `json:"chatMessage"`
}

func NewStateMessage(state ClientState) Message {
	return Message{
		Type:        "state",
		State:       &state,
		Clients:     nil,
		ChatMessage: nil,
	}
}

func NewClientsMessage(clients []*Client) Message {
	return Message{
		Type:        "clients",
		State:       nil,
		Clients:     clients,
		ChatMessage: nil,
	}
}

func NewChatMessageMessage(message ChatMessage) Message {
	return Message{
		Type:        "chat-message",
		State:       nil,
		Clients:     nil,
		ChatMessage: &message,
	}
}
