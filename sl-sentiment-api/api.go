package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

var MONGO_HOST = os.Getenv("MONGO_HOST")
var MONGO_DB = os.Getenv("MONGO_DB")
var MONGO_COLLECTION = os.Getenv("MONGO_COLLECTION")

func main() {
	app := fiber.New(fiber.Config{
		ServerHeader: "sentilens",
		AppName:      "sentilens",
	})

	app.Use(logger.New(logger.Config{
		Format: "${time} | ${ip} | ${method} | ${url} | ${status} | ${latency} | ${error}\n",
	}))

	SetUpRoutes(app)

	app.Listen(":8080")
}
