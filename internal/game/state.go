package game

type Action struct {
	Type string
}

type State struct{}

func Reducer(instance *Instance, action Action) {
	switch action.Type {
	default:
		return
	}
}
