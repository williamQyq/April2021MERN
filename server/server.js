const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const { test } = require('./unit_test.js'); //unit test for python scripts
const { scrapeScheduler } = require('./script_packages/scrapeScheduler.js');    //scripts scheduler, node-cron
const { amazonScheduler } = require('./amazonSP/amazonSchedule.js');
const { bbLinkScraper } = require('./script_packages/scraper.js');
const wms = require("./wmsDatabase.js");    // @local wms server connection
const { Server } = require("socket.io")
// @CREATE WMS CONNECTION
wms.wmsService();

//@Bodyparser Middleware
const app = express();
app.use(express.json());

const server = require("http").createServer(app)
const io = new Server(server);
const port = process.env.PORT || 5000;

//@Mongoose connection; Connect to Mongo.
const mongoURI = config.get('mongoURI');

mongoose.connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(() => console.log('Atlas MongoDB Connected...'))
    .catch(err => console.log(err));

// @server connection
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


//@routes; direct axios request from client
app.use('/api/bb_items', require('./routes/api/bb_items'));
app.use('/api/ms_items', require('./routes/api/ms_items'));
// app.use('/api/cc_items', require('./routes/api/cc_items'));
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/keepa', require('./routes/api/keepa'));
app.use('/api/wms', require('./routes/api/wms'));
app.use('/api/amazonSP', require('./routes/api/amazonSP'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../mern-project/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../mern-project', 'build', 'index.html'));
    });
}

io.on("connection", (socket) => {
    console.log(`A user Connected: ${socket.id}`)
    socket.on(`disconnect`, () => {
        console.log(`USER DISCONNECTED`);
    })
})

const db = mongoose.connection;  //set up mongoose connection
const collection = config.get("collection");
db.once('open', () => {
    const bestbuyStore = db.collection(collection.bestbuy);
    // const productPriceListings = db.collection(collection.watchList);
    const amzProdPricing = db.collection(collection.amzProdPricing);

    // const changeStream = productPriceListings.watch();
    const bbChangeStream = bestbuyStore.watch();
    const amzProdPricStream = amzProdPricing.watch();

    bbChangeStream.on('change', (change) => {
        const doc = change.fullDocument;

        if (change.operationType === 'insert' || change.operationType === 'update') {
            io.sockets.emit(`server:changestream_bb`,null);

        }
    })

    amzProdPricStream.on('change', (change) => {
        // const doc = change.fullDocument;
        // console.log(`change fulldocument:=====`, JSON.stringify(change.fullDocument, null, 4))
        if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'delete') {
            io.sockets.emit(`amzProdPric changed`, null)
        }
    })
    // test();
    scrapeScheduler.start();
    // @AMAZON SP UPDATE
    // amazonScheduler.start();
    amazonScheduler();


    // changeStream.on('change', (change) => {
    //     const doc = change.fullDocument;

    //     if (change.operationType === 'insert') {

    //         //socket.emit
    //         io.sockets.emit(`server:changestream`, doc._id);
    //         bbLinkScraper(doc._id, doc.link);

    //     }

    //     if (change.operationType === 'delete') {
    //         //socket.emit
    //         io.sockets.emit(`server:changestream`, doc);
    //     }
    //     if (change.operationType === 'update') {
    //         //socket.emit
    //         io.sockets.emit(`server:changestream`, doc);
    //     }
    // })

});

