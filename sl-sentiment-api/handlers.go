package main

import (
	"context"
	"sort"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

type Article struct {
	TickerSymbol string    `json:"symbol"`
	Source       string    `json:"source"`
	Title        string    `json:"title"`
	Author       string    `json:"author"`
	Date         time.Time `json:"date"`
	Url          string    `json:"url"`
	Positive     float64   `json:"positive"`
	Negative     float64   `json:"negative"`
	Neutral      float64   `json:"neutral"`
}

func GetArticles(c *fiber.Ctx) error {
	result := []Article{}
	mc, _ := MongoClient()
	collection := mc.Collection

	tickerSymbol := c.Params("tickerSymbol")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"tickersymbol": tickerSymbol})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"data": nil, "error": err})
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		tmpArticle := Article{}
		err := cursor.Decode(&tmpArticle)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"data": nil, "error": err})
		}

		result = append(result, tmpArticle)

	}

	return c.Status(200).JSON(fiber.Map{"data": result, "error": nil})
}

func GetSentiment(c *fiber.Ctx) error {

	result := []Article{}
	mc, _ := MongoClient()
	collection := mc.Collection

	tickerSymbol := c.Params("tickerSymbol")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"tickersymbol": tickerSymbol})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"data": nil, "error": err})
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		tmpArticle := Article{}
		err := cursor.Decode(&tmpArticle)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"data": nil, "error": err})
		}
		tmpArticle.Date = time.Date(tmpArticle.Date.Year(), tmpArticle.Date.Month(), tmpArticle.Date.Day(), 0, 0, 0, 0, tmpArticle.Date.Location())
		result = append(result, tmpArticle)
	}

	// Culculate average weekly sentiment
	aggregatedSentiment := map[time.Time]map[string]float64{}

	for _, article := range result {
		year, weekNumber := article.Date.ISOWeek()
		week := time.Date(year, time.January, 1, 0, 0, 0, 0, time.UTC).AddDate(0, 0, (weekNumber-1)*7)

		if _, exists := aggregatedSentiment[week]; !exists {
			aggregatedSentiment[week] = map[string]float64{}
		}
		aggregatedSentiment[week]["positive"] += article.Positive
		aggregatedSentiment[week]["neutral"] += article.Neutral
		aggregatedSentiment[week]["negative"] += article.Negative
		aggregatedSentiment[week]["articlesCount"] += 1
	}

	for date, sentiment := range aggregatedSentiment {
		sentiment["positive"] /= sentiment["articlesCount"]
		sentiment["neutral"] /= sentiment["articlesCount"]
		sentiment["negative"] /= sentiment["articlesCount"]
		if (sentiment["positive"] + sentiment["neutral"] + sentiment["negative"]) < 0.99 {
			delete(aggregatedSentiment, date)
		}
	}

	// Sort by sentiment by date
	var keys []time.Time
	for k := range aggregatedSentiment {
		keys = append(keys, k)
	}

	// Step 2: Sort the keys (time.Time)
	sort.Slice(keys, func(i, j int) bool {
		return keys[i].Before(keys[j])
	})

	// Step 3: Create a slice to hold the sorted results
	type SentimentResult struct {
		Date      time.Time          `json:"date"`
		Sentiment map[string]float64 `json:"sentiment"`
	}
	var sortedResults []SentimentResult

	// Step 4: Store the sorted results in the slice
	for _, k := range keys {
		sortedResults = append(sortedResults, SentimentResult{
			Date:      k,
			Sentiment: aggregatedSentiment[k],
		})
	}

	return c.Status(200).JSON(fiber.Map{"data": sortedResults, "error": nil})
}
