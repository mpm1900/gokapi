package game

type Message struct {
	Type    string    `json:"type"`
	State   *State    `json:"state"`
	Clients []*Client `json:"clients"`
}

func NewStateMessage(state State) Message {
	return Message{
		Type:    "state",
		State:   &state,
		Clients: nil,
	}
}

func NewClientsMessage(clients []*Client) Message {
	return Message{
		Type:    "clients",
		State:   nil,
		Clients: clients,
	}
}
