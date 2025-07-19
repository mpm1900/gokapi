OUT_DIR=./bin

build-server:
	go build -o $(OUT_DIR)/server cmd/server/main.go

run-server:
	go run cmd/server/main.go
	
migrate-db:
	go run cmd/migrations/main.go
