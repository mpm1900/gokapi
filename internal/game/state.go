package game

type Action struct {
	Type string
}

const INCREMENT = "INCREMENT"

type State struct {
	Value uint `json:"value"`
}

func Reducer(instance *Instance, action Action) bool {
	switch action.Type {
	case INCREMENT:
		instance.State.Value++
		return true
	default:
		return false
	}
}
