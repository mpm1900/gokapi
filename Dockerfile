# Node Build (for web)
FROM node:lts-alpine AS web

WORKDIR /web

COPY ./web/package.json ./
RUN npm install --omit=dev
COPY ./web ./
RUN npm run build

# Go Build
FROM golang:1.24-alpine AS go

WORKDIR /server

COPY .air.toml ./
RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod download

COPY ./cmd ./cmd
COPY ./database ./database
COPY ./internal ./internal
COPY ./certs ./certs

RUN mkdir -p ./web
COPY --from=web /web/dist /server/web/dist

EXPOSE 8443

CMD ["air", "-c", ".air.toml"]
# CMD ["/server/bin/server"] # for production, do not uncomment
