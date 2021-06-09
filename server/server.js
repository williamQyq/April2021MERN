const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');

//Bodyparser Middleware
// const app = express();
// app.use(express.json());

//DB Config
const db = require('./config/keys').mongoURI;
const keys = require('./config/keys');
//Connect to Mongo

async function main() {
    
    const client = new MongoClient(db, {useUnifiedTopology:true});

    try {
        await client.connect();
        
        // await createListing(client, {
        //     name: "DP ENVY",
        //     price: "799"
        // })
        await createMultipleListings(client, [
            {
                name: "CP ENVY",
                price: "799"
            },
            {
                name: "BP ENVY",
                price: "799"
            },
            {
                name: "AP ENVY",
                price: "799"
            },
        ]);

    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }

}

main().catch(console.error);

//CRUD - create
async function createMultipleListings(client, newListings) {
    const result = await client.db(keys.DB).collection(keys.Collections.ProductsPriceListings)
    .insertMany(newListings);
    console.log(`${result.insertedCount} new Listings created with the following id(s):`);
    console.log(result.insertedIds);
}

async function createListing(client, newListing) {
    const result = await client.db('DB').collection("ProductsPirceListings")
    .insertOne(newListing);

    console.log(`New listing created with the following id: ${result.insertedId}`);

}

//CRUD - read
async function findOneListingByName(client, nameOfListing) {
    // const result = await client.db(DB).collection("ProductsListings")
}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}