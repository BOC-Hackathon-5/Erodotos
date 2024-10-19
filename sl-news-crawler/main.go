package main

import (
	"net/http"
	"os"

	"github.com/gocolly/colly"
)

var client = &http.Client{}
var newsScraper = colly.NewCollector()
var NEWS_API_ENDPOINT = os.Getenv("NEWS_API_ENDPOINT")
var NEWS_API_KEY = os.Getenv("NEWS_API_KEY")
var SENTIMENT_MODEL_ENDPOINT = os.Getenv("SENTIMENT_MODEL_ENDPOINT")
var HUGGING_FACE_API_KEY = os.Getenv("HUGGING_FACE_API_KEY")
var TICKER_SYMBOLS_PATH string = os.Getenv("TICKER_SYMBOLS_PATH")
var MONGO_HOST = os.Getenv("MONGO_HOST")
var MONGO_DB = os.Getenv("MONGO_DB")
var MONGO_COLLECTION = os.Getenv("MONGO_COLLECTION")

func main() {
	// Number of workers in the pool
	numWorkers := 4

	// Channel to send jobs from master to workers
	jobs := make(chan string)

	// Start the workers
	for i := 1; i <= numWorkers; i++ {
		go worker(i, jobs)
	}

	// Start the master controller
	go master(jobs)

	// Block the main goroutine (keep it running)
	select {}
}
