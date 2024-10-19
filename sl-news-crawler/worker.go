package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gocolly/colly"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type NewsApiResponse struct {
	Status       string `json:"status"`
	TotalResults int    `json:"totalResults"`
	Articles     []struct {
		Source struct {
			Id   string `json:"id"`
			Name string `json:"name"`
		} `json:"source"`
		Author      string `json:"author"`
		Title       string `json:"title"`
		Description string `json:"description"`
		Url         string `json:"url"`
		UrltoImage  string `json:"urlToImage"`
		PublishedAt string `json:"publishedAt"`
		Content     string `json:"content"`
	} `json:"articles"`
}

type Article struct {
	TickerSymbol string  `json:"symbol"`
	Source       string  `json:"source"`
	Title        string  `json:"title"`
	Author       string  `json:"author"`
	Date         string  `json:"date"`
	Url          string  `json:"url"`
	Positive     float64 `json:"positive"`
	Negative     float64 `json:"negative"`
	Neutral      float64 `json:"neutral"`
}

// Worker function that waits for tasks on the jobs channel
func worker(id int, jobs <-chan string) {
	for tickerSymbol := range jobs {
		log.Printf("[Worker %d][Info] - %s | Initiation Scraping", id, tickerSymbol)
		articlesURLs, err := retrieveLatestArticles(tickerSymbol)
		if err != nil {
			log.Printf("[Worker %d][Error] - %s | Error: %s", id, tickerSymbol, err.Error())
		}

		// Filter new articles
		newArticles := filterNewArticles(articlesURLs)
		log.Printf("[Worker %d][Info] - %s | %d new articles found ", id, tickerSymbol, len(newArticles.Articles))

		// culculate news sentiment
		for _, article := range newArticles.Articles {
			var positive float64 = 0
			var negative float64 = 0
			var neutral float64 = 0

			// Scrape news text from each article
			rawNews, err := scrapeNews(article.Url)
			if err != nil {
				log.Printf("[Worker %d][Error] - %s | Error: %s", id, tickerSymbol, err.Error())
			}

			// culculate sentiment per article
			newsPart := ""
			counter := 0
			for _, paragraph := range rawNews {
				if len(newsPart)+len(paragraph) < 512 {
					newsPart += paragraph
				} else {
					sentiment, _ := culculateSentiment(newsPart)

					for _, category := range sentiment {

						label := category.(map[string]interface{})["label"]
						score := category.(map[string]interface{})["score"]

						switch label.(string) {
						case "positive":
							positive += score.(float64)
						case "negative":
							negative += score.(float64)
						case "neutral":
							neutral += score.(float64)
						default:
							fmt.Println("Unknown label")
						}
					}

					newsPart = ""
					counter++
				}
			}

			if counter < 1 {
				log.Printf("[Worker %d][Info] - %s | Skipping Empty Article: %s ", id, tickerSymbol, article.Title)
				continue
			}

			a := Article{
				TickerSymbol: tickerSymbol,
				Source:       article.Source.Name,
				Title:        article.Title,
				Author:       article.Author,
				Date:         article.PublishedAt,
				Url:          article.Url,
				Positive:     positive / float64(counter),
				Negative:     negative / float64(counter),
				Neutral:      neutral / float64(counter),
			}

			fmt.Println(a)

			res, err := insertToMongo(a)
			if err != nil {
				log.Printf("[Worker %d][Error] - %s | Error: %s", id, tickerSymbol, err.Error())
			}

			log.Printf("[Worker %d][Info] - %s | %s ", id, tickerSymbol, res)
		}
	}
}

func retrieveLatestArticles(tickerSymbol string) (*NewsApiResponse, error) {
	// Retrieve all articles URLs
	articlesUrl, err := callNewsApi(tickerSymbol, 1)
	if err != nil {
		return nil, err
	}

	pageNumber := 2
	for i := articlesUrl.TotalResults - 100; i > 0; i -= min(100, i) {
		tmpRes, err := callNewsApi(tickerSymbol, pageNumber)
		if err != nil {
			return nil, err
		}
		articlesUrl.Articles = append(articlesUrl.Articles, tmpRes.Articles...)
		pageNumber++
	}

	return articlesUrl, nil
}

func callNewsApi(tickerSymbol string, pageNumber int) (*NewsApiResponse, error) {
	// Create HTTP Request
	req, err := http.NewRequest("GET", NEWS_API_ENDPOINT, nil)
	if err != nil {
		return nil, err
	}

	// Add Request Header
	req.Header.Add("Accept", `application/json`)

	// Add Request Parameters
	q := req.URL.Query()
	q.Add("q", tickerSymbol)
	q.Add("language", "en")
	q.Add("domains", "yahoo.com")
	q.Add("sortby", "publishedAt")
	q.Add("page", strconv.Itoa(pageNumber))
	q.Add("apiKey", NEWS_API_KEY)
	req.URL.RawQuery = q.Encode()

	// Execute HTTP Request
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)

	result := NewsApiResponse{}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	return &result, nil
}

func scrapeNews(url string) ([]string, error) {
	article := []string{}

	newsScraper.OnHTML("p", func(e *colly.HTMLElement) {
		article = append(article, e.Text)
	})

	newsScraper.Visit(url)

	return article, nil
}

func culculateSentiment(text string) ([]interface{}, error) {
	// Prepare hugging face POST request payload
	payload, err := json.Marshal(
		map[string]interface{}{
			"inputs": text,
			"parameters": map[string]interface{}{
				"top_k": 3,
			},
		},
	)

	if err != nil {
		return nil, err
	}

	// Prepare a new HTTP request
	req, err := http.NewRequest("POST", SENTIMENT_MODEL_ENDPOINT, bytes.NewBuffer(payload))
	if err != nil {
		return nil, err
	}

	// Set headers request headers
	req.Header.Set("Authorization", "Bearer "+HUGGING_FACE_API_KEY)
	req.Header.Set("Content-Type", "application/json")

	// Execute request
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result []interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}
	return result, nil
}

func insertToMongo(article Article) (*mongo.InsertOneResult, error) {
	mc, _ := MongoClient()
	collection := mc.Collection

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := collection.InsertOne(ctx, article)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func filterNewArticles(articlesURLs *NewsApiResponse) *NewsApiResponse {
	mc, _ := MongoClient()
	collection := mc.Collection

	newArticles := NewsApiResponse{}

	for _, article := range articlesURLs.Articles {

		result := Article{}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		err := collection.FindOne(ctx, bson.M{"url": article.Url}).Decode(&result)
		if err == mongo.ErrNoDocuments {
			newArticles.Articles = append(newArticles.Articles, article)
		}

	}

	return &newArticles
}
