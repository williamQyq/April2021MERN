import mongoose from 'mongoose';
import { Server } from "socket.io";
import app from './index.js';
import wms from "./wms/wmsDatabase.js";    // @local wms server connection
import scrapeScheduler from './bin/scrapeScheduler.js';    //scripts scheduler, node-cron
// import { amazonScheduler } from './amazonSP/amazonSchedule.js';
import unitTest from './unit_test.js'   //For testing functionalities

// console.log('dotev',process.env.DB_URI)

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
const mongoURI = config.get('mongoURI');
mongoose.connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(() => console.log('Atlas MongoDB Connected...'))
    .catch(err => console.log(err));

const db = mongoose.connection;  //set up mongoose connection
db.once('open', () => {
    const collection = config.get("collection");

    const bbStoreListings = db.collection(collection.bestbuy).watch();
    const amzProdPricing = db.collection(collection.amzProdPricing).watch();
    const itemSpec = db.collection(collection.itemSpec).watch();

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

