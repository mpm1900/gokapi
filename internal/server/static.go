package server

import (
	"net/http"
	"os"
	"path/filepath"
)

type StaticHandler struct {
	fs        http.Handler
	staticDir string
	indexPath string
}

func NewStaticHandler(staticPath, entryFile string) (*StaticHandler, error) {
	absStaticPath, err := filepath.Abs(staticPath)
	if err != nil {
		return nil, err
	}

	return &StaticHandler{
		fs:        http.FileServer(http.Dir(absStaticPath)),
		staticDir: absStaticPath,
		indexPath: filepath.Join(absStaticPath, entryFile),
	}, nil
}

func (h *StaticHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	requestedAbsPath := filepath.Join(h.staticDir, r.URL.Path)

	fileInfo, err := os.Stat(requestedAbsPath)

	if os.IsNotExist(err) || (err == nil && fileInfo.IsDir()) {
		http.ServeFile(w, r, h.indexPath)
		return
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	h.fs.ServeHTTP(w, r)
}
