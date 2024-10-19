package main

import (
	"encoding/csv"
	"log"
	"os"
	"time"
)

// Master controller that sends jobs to the worker pool every one hour
func master(jobs chan<- string) {
	for {

		// Fetch stock symbols from file
		tickerSymbols, _ := readTickerSymbolsFromFile()

		// Send task to the workers
		for _, symbol := range tickerSymbols[1:] {
			jobs <- symbol[0]
		}

		// Wait for 1 hour before initiating a new
		// scraping operation
		time.Sleep(1 * time.Hour)
	}
}

// Opens a CSV file where there is a list of stocks to check
// the CSV file path is passed via env variable
func readTickerSymbolsFromFile() ([][]string, error) {
	// Read stocks from file
	f, err := os.Open(TICKER_SYMBOLS_PATH)
	if err != nil {
		log.Fatal("Unable to read input file "+TICKER_SYMBOLS_PATH, err)
		return nil, err
	}
	defer f.Close()

	csvReader := csv.NewReader(f)
	records, err := csvReader.ReadAll()
	if err != nil {
		log.Fatal("Unable to parse file as CSV for "+TICKER_SYMBOLS_PATH, err)
		return nil, err
	}

	return records, nil
}
