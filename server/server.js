const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const { collections } = require('./config/keys.js'); //DB Config
// const { test } = require('./unit_test.js'); //unit test for python scripts
//cron schelduler
const { scrapeBBScheduler } = require('./script_packages/scrapeScheduler.js');    //process scripts scheduler
const { bbLinkScraper } = require('./script_packages/scraper.js');

//Bodyparser Middleware
const app = express();
app.use(express.json());

const server = require("http").createServer(app)
const io = require("socket.io")(server);

const mongoURI = config.get('mongoURI');

//Connect to Mongo
mongoose.connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})                //build mongoose connection
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/api/bb_items', require('./routes/api/bb_items'));
// app.use('/api/cc_items', require('./routes/api/cc_items'));
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

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

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

