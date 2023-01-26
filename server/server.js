import mongoose from 'mongoose';
import io from './index.js';    //socket io
// import startScrapeScheduler from './bin/scrapeScheduler.js';    //scripts scheduler, node-cron
// import startAmazonScheduler from '#amz/amazonSchedule.js';

//@Mongoose connection; Connect to Mongo.
const mongoURI = process.env.DB_URI;
mongoose.set('strictQuery', false);
mongoose.connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('Atlas MongoDB Connected...'))
    .catch(err => console.error('\nMongoCloud Error: \n\n', err));

const db = mongoose.connection;  //set up mongoose connection
db.once('open', () => {
    const COL_BESTBUY = process.env.DB_COLLECTION_BESTBUY
    const COL_MICROSOFT = process.env.DB_COLLECTION_MICROSOFT
    const COL_AMZ_PROD_PRICING = process.env.DB_COLLECTION_AMZ_PROD_PRICING
    const COL_ITEMSPEC = process.env.DB_COLLECTION_ITEMSPEC

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

    // unitTest();
    // startScrapeScheduler();
    // @AMAZON SP UPDATE
    // startAmazonScheduler();
    // amazonScheduler()

});

