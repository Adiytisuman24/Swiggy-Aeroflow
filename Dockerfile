# This Dockerfile allows building the primary orchestration layer (core) 
# if you accidentally run "docker build ." directly in the root directory.
#
# To run the entire multi-service stack, please run:
#   docker-compose up --build

FROM golang:1.21-alpine

WORKDIR /app

COPY core/go.mod ./
RUN go mod download

COPY core/ .

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]
