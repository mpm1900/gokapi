package game

import (
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
)

type Question struct {
	id           uuid.UUID
	seconds      int
	query        string
	freeform     bool
	possible     []string
	choices      []string
	correctIndex int
}

type LiveQuestion struct {
	Question
	mu      sync.RWMutex
	timer   *time.Timer
	ticker  *time.Ticker
	answers map[uuid.UUID]Answer
	results map[uuid.UUID]int
}

type Answer struct {
	index  int
	answer string
}

func (q Question) Upgrade() LiveQuestion {
	return LiveQuestion{
		Question: q,
		mu:       sync.RWMutex{},
		timer:    time.NewTimer(time.Second * time.Duration(q.seconds)),
		ticker:   time.NewTicker(time.Second),
		answers:  make(map[uuid.UUID]Answer),
		results:  make(map[uuid.UUID]int),
	}
}

func (lq *LiveQuestion) Run(game *Instance) {
	defer func() {
		fmt.Println("LiveQUestion.Run ... end")
	}()

	lq.timer.Reset(time.Second * time.Duration(lq.seconds))

	for {
		select {
		case <-lq.ticker.C:
			action := Action{
				Type: INCREMENT,
			}
			game.ReadAction <- action
		case <-lq.timer.C:
			lq.ticker.Stop()

			action := Action{
				Type:    SET_RUNNING_P,
				Running: false,
			}
			game.ReadAction <- action
			return
		}
	}
}
