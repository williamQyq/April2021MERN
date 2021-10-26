const express = require('express');
const mongoose = require('mongoose');
//DB Config
const { mongoURL, collections } = require('./config/keys.js');


//Bodyparser Middleware
const app = express();
app.use(express.json());

const server = require("http").createServer(app)
const io = require("socket.io")(server);

//unit test for python scripts
// const { test } = require('./unit_test.js');
//cron schelduler
const { scrapeBBScheduler } = require('./script_packages/scrapeScheduler.js');    //process scripts scheduler
const { bbLinkScraper } = require('./script_packages/scraper.js');
const path = require('path');

//Connect to Mongo
mongoose.connect(mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})                //build mongoose connection
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/api/bb_items', require('./routes/api/bb_items'));
app.use('/api/cc_items', require('./routes/api/cc_items'));
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../mern-project/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../mern-project', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

io.on("connection", (socket) => {
    console.log(`A user Connected: ${socket.id}`)
    socket.on(`disconnect`, () => {
        console.log(`USER DISCONNECTED`);
    })
})

const db = mongoose.connection;                                                             //set up mongoose connection
db.once('open', () => {
    const bbProductListings = db.collection(collections.itemListingsBB);
    const productPriceListings = db.collection(collections.productsPriceListings);

    const changeStream = productPriceListings.watch();
    const BBChangeStream = bbProductListings.watch();

    BBChangeStream.on('change', (change) => {
        const doc = change.fullDocument;

        if (change.operationType === 'insert' || change.operationType === 'update') {
            io.sockets.emit(`server:changestream_bb`, doc);

        }

    })
    // test();
    // scrapeBBScheduler.start();

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

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

