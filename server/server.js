const express = require('express');
const mongoose = require('mongoose');
//DB Config
const dbURI = require('./config/keys').mongoURI;
const keys = require('./config/keys');
const path = require('path');

//Bodyparser Middleware
const app = express();
app.use(express.json());

const server = require("http").createServer(app)
const io = require("socket.io")(server);

//run python process
const { py_process } = require('./py_process');

const Item = require("./models/Item");

//Connect to Mongo
mongoose.connect(dbURI, { 
        useUnifiedTopology: true, 
        useNewUrlParser: true,
        useCreateIndex: true
    })                //build mongoose connection
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../mern-project/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../mern-project', 'build', 'index.html'));
    });
}

// console.log(`dirname=====${path.resolve(__dirname, '../mern-project', 'build', 'index.html')}`)
const port = process.env.PORT || 5000;

io.on("connection", (socket) => {
    console.log(`A user Connected: ${socket.id}`)
    socket.on(`disconnect`, () => {
        console.log(`USER DISCONNECTED`);
    })
})

const db = mongoose.connection;                                                             //set up mongoose connection
db.once('open', () => {

    const productPriceListings = db.collection(keys.Collections.ProductsPriceListings);

    const changeStream = productPriceListings.watch();
    changeStream.on('change', (change) => {
        // console.log(change);
        if (change.operationType === 'insert') {
            let arr = [];
            const doc = change.fullDocument;

            const product = {
                _id: doc._id,
                link: doc.link,
                name: doc.name,
                price_timestamp: doc.price_timestamps.pop()
            }

            //socket.emit
            io.sockets.emit(`server:changestream`, product);

            arr.push(product);
            py_process(arr);                                                                //py_process takes array of object

        }
        if (change.operationType === 'delete') {
            const doc = change.fullDocument;
            //socket.emit
            io.sockets.emit(`server:changestream`, doc);
        }
        if (change.operationType === 'update') {
            const doc = change.fullDocument;
            //socket.emit
            io.sockets.emit(`server:changestream`, doc);
        }
    })

});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

