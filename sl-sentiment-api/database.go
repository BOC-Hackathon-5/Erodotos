package main

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type MongoInstance struct {
	Client     *mongo.Client
	Db         *mongo.Database
	Collection *mongo.Collection
}

var mg *MongoInstance

func MongoClient() (MongoInstance, error) {

	// Reuse Connection if exists
	if mg != nil {
		return *mg, nil
	}

	// Create new Mongo instance
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(MONGO_HOST))
	if err != nil {
		return MongoInstance{}, err
	}

	// Check database connection
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		panic(err)
	}

	// Create Mongo Instance
	mg = &MongoInstance{
		Client:     client,
		Db:         client.Database(MONGO_DB),
		Collection: client.Database(MONGO_DB).Collection(MONGO_COLLECTION),
	}

	return *mg, nil
}
