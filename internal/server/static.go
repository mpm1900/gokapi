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

func NewStaticHandler(staticPath, entryFile string) *StaticHandler {
	absStaticPath, err := filepath.Abs(staticPath)
	if err != nil {
		// This error should ideally be handled at a higher level or logged
		// For now, we'll return a handler that always errors
		return &StaticHandler{
			fs: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				http.Error(w, "Internal server error: static path not resolved", http.StatusInternalServerError)
			}),
			staticDir: "",
			indexPath: "",
		}
	}

	return &StaticHandler{
		fs:        http.FileServer(http.Dir(absStaticPath)),
		staticDir: absStaticPath,
		indexPath: filepath.Join(absStaticPath, entryFile),
	}
}

func (h StaticHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	requestedAbsPath := filepath.Join(h.staticDir, r.URL.Path)

	fileInfo, err := os.Stat(requestedAbsPath)

	if os.IsNotExist(err) || (err == nil && fileInfo.IsDir()) {
		http.ServeFile(w, r, h.indexPath)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	h.fs.ServeHTTP(w, r)
}
