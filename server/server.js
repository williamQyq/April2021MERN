import mongoose from 'mongoose';
import io from './index.js';    //socket io
import wms from "./wms/wmsDatabase.js";    // @local wms server connection
import startScrapeScheduler from './bin/scrapeScheduler.js';    //scripts scheduler, node-cron
import startAmazonScheduler from '#amz/amazonSchedule.js';
import unitTest from './unit_test.js'   //For testing functionalities

// @CREATE WMS CONNECTION
wms.connect(wms.config, () => console.log(`WMS Database Connected...`));

//@Mongoose connection; Connect to Mongo.
const mongoURI = process.env.DB_URI;
mongoose.connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(() => console.log('Atlas MongoDB Connected...'))
    .catch(err => console.log(err));

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
    // startamazonScheduler();
    // amazonScheduler()

});

