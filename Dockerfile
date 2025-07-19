# Bun Build
FROM oven/bun:1.1.17 AS bun

WORKDIR /web

COPY ./web/package.json ./web/bun.lock ./
RUN bun install --frozen-lockfile

COPY ./web ./
RUN bun run build

# Go Build
FROM golang:1.24-alpine AS go

WORKDIR /app

RUN go install github.com/air-verse/air@latest
RUN apk add --no-cache make

COPY go.mod go.sum Makefile ./
RUN go mod download

COPY ./cmd ./cmd
COPY ./database ./database
COPY ./internal ./internal

COPY --from=bun /web/dist ./web/dist

EXPOSE 8080

CMD ["air", "-c", ".air.toml"]
