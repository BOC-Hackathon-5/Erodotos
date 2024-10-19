################ STAGE - 1: BUILD APP ######################
FROM golang:1.23 as builder
LABEL maintainer="Erodotos Demetriou <erodotosd@gmail.com>"
COPY ${PWD} /app
WORKDIR /app

RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -a -ldflags '-s -w -extldflags "-static"' -o main .

################ STAGE - 2: WRAP APP BINARY IN AN OS IMAGE ######################
FROM alpine
LABEL maintainer="Erodotos Demetriou <erodotosd@gmail.com>"
WORKDIR /app
COPY --from=builder /app/main .

# Start the App
CMD ["./main"]
