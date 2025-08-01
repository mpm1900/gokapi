package game

import (
	"time"

	"github.com/google/uuid"
)

type ChatMessage struct {
	From      uuid.UUID `json:"from"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}
