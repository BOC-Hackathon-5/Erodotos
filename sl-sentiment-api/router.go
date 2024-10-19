package main

import "github.com/gofiber/fiber/v2"

func SetUpRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Get("/articles/:tickerSymbol", GetArticles)
	api.Get("/sentiment/:tickerSymbol", GetSentiment)
}
