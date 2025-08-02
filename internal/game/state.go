package game

type Action struct {
	Type        string
	ChatMessage ChatMessage
}

const INCREMENT = "INCREMENT"
const CHAT_MESSAGE = "CHAT_MESSAGE"

type State struct {
	Value uint
}

type ClientState struct {
	Value uint `json:"value"`
}

const (
	state = iota
	clients
	chatMessage
	none
)

func Reducer(instance *Instance, action Action) int {
	switch action.Type {
	case INCREMENT:
		instance.State.Value++
		return state
	case CHAT_MESSAGE:
		return chatMessage
	default:
		return none
	}
}

func (state State) ToClient(client *Client) ClientState {
	return ClientState{
		Value: state.Value,
	}
}
