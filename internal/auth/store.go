package auth

import (
	"fmt"
	"sync"
)

type Store struct {
	mu sync.RWMutex
	db map[string]string
}

func NewStore() *Store {
	return &Store{
		db: make(map[string]string),
	}
}

func (s *Store) Set(key, value string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.db[key] = value
	fmt.Println(key, value, s.db)
}

func (s *Store) Get(key string) (string, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	value, ok := s.db[key]
	return value, ok
}

func (s *Store) Delete(key string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.db, key)
}
