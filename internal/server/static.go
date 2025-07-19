package server

import (
	"net/http"
	"os"
	"path/filepath"
)

type StaticHandler struct {
	Path  string
	Entry string
}

func (h *StaticHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := filepath.Join(h.Path, r.URL.Path)
	file, err := os.Stat(path)

	if os.IsNotExist(err) || file.IsDir() {
		path = filepath.Join(h.Path, h.Entry)
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.ServeFile(w, r, path)
}
