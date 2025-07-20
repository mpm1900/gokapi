# Bun Build
FROM oven/bun:1.1.17 AS bun

WORKDIR /web

COPY ./web ./
RUN bun install --frozen-lockfile
RUN bun run build

# Go Build
FROM golang:1.24-alpine AS go

WORKDIR /server

COPY .air.toml ./
RUN go install github.com/air-verse/air@latest
RUN apk add --no-cache make

COPY go.mod go.sum Makefile ./
RUN go mod download

COPY ./cmd ./cmd
COPY ./database ./database
COPY ./internal ./internal

RUN mkdir -p ./web
COPY --from=bun /web/dist /server/web/dist

# RUN make build-server

EXPOSE 8080

CMD ["air", "-c", ".air.toml"]
# CMD ["/server/bin/server"]
