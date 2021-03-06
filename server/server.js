import mongoose from 'mongoose';
import { Server } from "socket.io";
import app from './index.js';
import wms from "./wms/wmsDatabase.js";    // @local wms server connection
import scrapeScheduler from './bin/scrapeScheduler.js';    //scripts scheduler, node-cron
// import { amazonScheduler } from './amazonSP/amazonSchedule.js';
import unitTest from './unit_test.js'   //For testing functionalities

// @CREATE WMS CONNECTION
wms.startService();

const io = new Server(app, { 'pingTimeout': 7000, 'pingInterval': 3000 });
io.on("connection", (socket) => {
    console.log(`A user Connected: ${socket.id}`)
    socket.on(`disconnect`, () => {
        console.log(`USER DISCONNECTED`);
    })
})

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
    const COL_AMZ_PROD_PRICING = process.env.DB_COLLECTION_AMZ_PROD_PRICING
    const COL_ITEMSPEC = process.env.DB_COLLECTION_ITEMSPEC

    const bbStoreListings = db.collection(COL_BESTBUY).watch();
    const amzProdPricing = db.collection(COL_AMZ_PROD_PRICING).watch();
    const itemSpec = db.collection(COL_ITEMSPEC).watch();

    bbStoreListings.on('change', (change) => {
        // const doc = change.fullDocument;
        // console.log(`change fulldocument:=====`, JSON.stringify(change.fullDocument, null, 4))
        if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'delete') {
            io.sockets.emit(`bbStoreListings`, null)
        }
    })
    amzProdPricing.on('change', (change) => {
        if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'delete') {
            io.sockets.emit(`amzProdPricing`, null)
        }
    })
    itemSpec.on('change', (change) => {
        if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'delete') {
            io.sockets.emit(`itemSpec`, null)
        }
    })

    unitTest();
    scrapeScheduler.start();
    // @AMAZON SP UPDATE
    // amazonScheduler.start();
    // amazonScheduler()

});

