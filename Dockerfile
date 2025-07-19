FROM  golang:1.24-alpine

WORKDIR /app

COPY go.mod go.sum Makefile ./
RUN go mod download

RUN go install github.com/air-verse/air@latest
RUN apk add --no-cache make

COPY . . 



EXPOSE 8080

CMD ["air", "-c", ".air.toml"]
