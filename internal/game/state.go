package game

type Action struct {
	Type string
}

type State struct{}

func Reducer(state State, action Action) State {
	switch action.Type {
	default:
		return state
	}
}
