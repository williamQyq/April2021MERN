import mongoose from 'mongoose';
import { Server } from "socket.io";
import app from './index.js';
import wms from "./wms/wmsDatabase.js";    // @local wms server connection
import scrapeScheduler from './bin/scrapeScheduler.js';    //scripts scheduler, node-cron
// import { amazonScheduler } from './amazonSP/amazonSchedule.js';
import unitTest from './unit_test.js'   //For testing functionalities

// @CREATE WMS CONNECTION
wms.startService();

// @Socket IO listner
const io = new Server(app, { 'pingTimeout': 7000, 'pingInterval': 3000 });
io.on("connection", (socket) => {
    socket.on(`subscribe`, (room) => {
        try {
            socket.join(room);
            console.log(`A user Connected: ${socket.id}. Joined Room: ${room}`)
        } catch (e) {
            console.error(`[Socket Error] join room error`, e)
        }
    })

    socket.on(`unsubscribe`, (room) => {
        try {
            // const rooms = io.sockets.adapter.sids[socket.id]
            socket.leave(room)
            console.log(`A user ${socket.id} leaved room: ${room}`)
        } catch (e) {
            console.error(`[Socket Error] leave room error`, e)
        }
    })

    socket.on(`disconnect`, () => {
        console.log(`USER DISCONNECTED: ${socket.id}`);
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
            io.sockets.in(`StoreListingRoom`).emit(`BB Store Listings Update`, null)
        }
    })

    msStoreListings.on('change', (change) => {
        if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'delete') {
            io.sockets.in(`StoreListingRoom`).emit(`MS Store Listings Update`, null)
        }
    })

    amzProdPricing.on('change', (change) => {
        if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'delete') {
            io.sockets.in(`AmzRoom`).emit(`Amz Prod Pricing Update`, null)
        }
    })
    itemSpec.on('change', (change) => {
        if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'delete') {
            io.sockets.in(`StoreListingRoom`).emit(`BB Store Listings Update`, null)
        }
    })

    unitTest();
    scrapeScheduler.start();
    // @AMAZON SP UPDATE
    // amazonScheduler.start();
    // amazonScheduler()

});

