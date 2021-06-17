const keys = require("./config/keys");
const db = require('./config/keys').mongoURI;
const { MongoClient } = require('mongodb');

async function main (){

    const client = new MongoClient(db, {useUnifiedTopology:true});

    try {
        await client.connect();

        await monitorListingsUsingEventEmitter(client, 15000);

    } finally {
        await client.close();
    }

}

main().catch(console.error);

async function monitorListingsUsingHasNext(client, timeInMs = 60000, pipeline = []) {
    const collection = client.db(keys.DB).collection(keys.Collections.ProductsPriceListings);
    const changeStream = collection.watch(pipeline);

    closeChangeStream(timeInMs, changeStream);
    try{
        while (await changeStream.hasNext()) {
            console.log(await changeStream.next());
        }
    } catch (error) {
        if (changeStream.closed) {
            console.log("The change stream is closed");
        } else {
            throw error;
        }
    }
}

async function monitorListingsUsingEventEmitter(client, timeInMs = 60000, pipeline = []) {
    const collection = client.db(keys.DB).collection(keys.Collections.ProductsPriceListings);

    const changeStream = collection.watch();
    
    changeStream.on('change', (next) => {
        console.log(next.fullDocument);
    });

    await closeChangeStream(timeInMs, changeStream);
}

/*
 * Close the given change stream after the given amount of time
 * @param {*} timeInMs The amount of time is ms to monitor listings
 *
*/

function closeChangeStream(timeInMs = 60000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve();
        }, timeInMs)
    });
}