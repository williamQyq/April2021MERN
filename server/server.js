const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const wmsConfig = require('./config/wmsConfig');
// const { test } = require('./unit_test.js'); //unit test for python scripts
const { scrapeBBScheduler } = require('./script_packages/scrapeScheduler.js');    //scripts scheduler, node-cron
const { bbLinkScraper } = require('./script_packages/scraper.js');
const wms = require("./wmsDatabase.js");    // @local wms server connection

//@Bodyparser Middleware
const app = express();
app.use(express.json());

const server = require("http").createServer(app)
const io = require("socket.io")(server);
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

// @WMS connection; Connect to WMS Database via tunnel-ssh
wms.connect(wmsConfig, () => { });


//@routes; direct axios request from client
app.use('/api/bb_items', require('./routes/api/bb_items'));
// app.use('/api/cc_items', require('./routes/api/cc_items'));
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/keepa', require('./routes/api/keepa'));
app.use('/api/wms', require('./routes/api/wms'));

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

const db = mongoose.connection;                                                             //set up mongoose connection
db.once('open', () => {
    const bbProductListings = db.collection(config.bestbuyCollection);
    const productPriceListings = db.collection(config.watchListCollection);

    const changeStream = productPriceListings.watch();
    const BBChangeStream = bbProductListings.watch();

    BBChangeStream.on('change', (change) => {
        const doc = change.fullDocument;

        if (change.operationType === 'insert' || change.operationType === 'update') {
            io.sockets.emit(`server:changestream_bb`, doc);

        }

    })
    // test();
    scrapeBBScheduler.start();

    changeStream.on('change', (change) => {
        const doc = change.fullDocument;

        if (change.operationType === 'insert') {

            //socket.emit
            io.sockets.emit(`server:changestream`, doc._id);
            bbLinkScraper(doc._id, doc.link);

        }

        if (change.operationType === 'delete') {
            //socket.emit
            io.sockets.emit(`server:changestream`, doc);
        }
        if (change.operationType === 'update') {
            //socket.emit
            io.sockets.emit(`server:changestream`, doc);
        }
    })

});

// @server connection
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
