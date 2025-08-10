package game

import (
	"fmt"
)

type Action struct {
	Type        string
	ChatMessage ChatMessage
	Running     bool
}

const INCREMENT = "INCREMENT"
const CHAT_MESSAGE = "CHAT_MESSAGE"
const UPGRADE_QUESTION = "UPGRADE_QUESTION"
const SET_RUNNING_P = "SET_RUNNING_P"

type State struct {
	Value        uint
	Running      bool
	Question     *Question
	LiveQuestion *LiveQuestion
}

type ClientState struct {
	Value   uint `json:"value"`
	Running bool `json:"running"`
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
	case UPGRADE_QUESTION:
		question := instance.State.Question.Upgrade()
		instance.State.LiveQuestion = &question
		instance.State.Value = 0
		instance.State.Running = true
		go question.Run(instance)
		return state
	case SET_RUNNING_P:
		fmt.Printf("SET_RUNNING_P %t\n", action.Running)
		instance.State.Running = action.Running
		return state
	default:
		return none
	}
}

func (state State) ToClient(client *Client) ClientState {
	return ClientState{
		Value:   state.Value,
		Running: state.Running,
	}
}
