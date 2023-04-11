import mongoose from 'mongoose';
import io from '#root/index.js';    //socket io
import config from 'config';
import dotenv from 'dotenv';
// import startScrapeScheduler from './bin/scrapeScheduler.js';    //scripts scheduler, node-cron
// import startAmazonScheduler from '#amz/amazonSchedule.js';
dotenv.config();
//@Mongoose connection; Connect to Mongo.
mongoose.set('strictQuery', false);

export async function connect() {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log('Atlas MongoDB Connected...')
    } catch (err: unknown) {
        console.error('\nMongoCloud Error: \n\n', err)
    }

}

const db = mongoose.connection;  //set up mongoose connection
db.once('open', () => {
    const COL_BESTBUY = config.get("db.col.bestbuy") as string;
    const COL_MICROSOFT = config.get("db.col.microsoft") as string;
    const COL_AMZ_PROD_PRICING = config.get("db.col.amzProdPricing") as string;
    const COL_ITEMSPEC = config.get("db.col.itemSpec") as string;

    const bbStoreListings = db.collection(COL_BESTBUY).watch();
    const msStoreListings = db.collection(COL_MICROSOFT).watch();
    const amzProdPricing = db.collection(COL_AMZ_PROD_PRICING).watch();
    const itemSpec = db.collection(COL_ITEMSPEC).watch();

    bbStoreListings.on('change', (change) => {
        // const doc = change.fullDocument;
        // console.log(`change fulldocument:=====`, JSON.stringify(change.fullDocument, null, 4))
        if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'delete') {
            io.sockets.in(`StoreListingRoom`).emit(`Store Listings Update`, null)
        }
    })

    msStoreListings.on('change', (change) => {
        if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'delete') {
            io.sockets.in(`StoreListingRoom`).emit(`Store Listings Update`, null)
        }
    })

    amzProdPricing.on('change', (change) => {
        if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'delete') {
            io.sockets.in(`OperationRoom`).emit(`Prod Pricing Update`, null)
        }
    })
    itemSpec.on('change', (change) => {
        if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'delete') {
            io.sockets.in(`StoreListingRoom`).emit(`Store Listings Update`, null)
        }
    })

});

export default db;