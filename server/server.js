const express = require('express');
const mongoose = require('mongoose');
const items = require('./routes/api/items');
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

//Connect to Mongo
mongoose.connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true })                //build mongoose connection
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/api/items', items);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../mern-project/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '/../mern-project', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

io.on("connection", (socket) => {
    console.log(`A user Connected: ${socket.id}`)
    socket.on(`disconnect`, () => {
        console.log(`USER DISCONNECTED`);
    })
})

//python process server==========
// py_app = express()
// const py_port = 4000;

// py_app.get('/', (req, res) => {
//     //let python process scrape website price
//     py_process(res);
// })

// py_app.listen(py_port, () => {
//     console.log(`example app listing on port ${py_port}`)
// })
//================================


const db = mongoose.connection;                                                             //set up mongoose connection
db.once('open', () => {

    const productPriceListings = db.collection(keys.Collections.ProductsPriceListings);

    const changeStream = productPriceListings.watch();
    changeStream.on('change', (change) => {
        // console.log(change);

        if (change.operationType === 'insert') {
            let arr = [];
            const listing = change.fullDocument;
            //socket.emit
            io.sockets.emit(`server:changestream`, listing);
            arr.push(listing);
            py_process(arr);                                                                //py_process takes array of object

        }
        if (change.operationType === 'delete') {
            const listing = change.fullDocument;
            //socket.emit
            io.sockets.emit(`server:changestream`, listing);
        }
        if (change.operationType === 'update') {
            const listing = change.fullDocument;
            //socket.emit
            io.sockets.emit(`server:changestream`, listing);
        }
    })

});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

