const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const { scrapeScheduler } = require('./script_packages/scrapeScheduler.js');    //scripts scheduler, node-cron
const { amazonScheduler } = require('./amazonSP/amazonSchedule.js');
const wms = require("./wms/wmsDatabase.js");    // @local wms server connection
const { Server } = require("socket.io");
// @CREATE WMS CONNECTION
wms.startService();

//@Bodyparser Middleware
const app = express();
app.use(express.json());

const server = require("http").createServer(app)
const io = new Server(server, { 'pingTimeout': 7000, 'pingInterval': 3000 });
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
app.use('/api/operation', require('./routes/api/operation'));
app.use('/api/inbound', require('./routes/api/inbound'));

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

    scrapeScheduler.start();
    // @AMAZON SP UPDATE
    // amazonScheduler.start();
    amazonScheduler();

});

