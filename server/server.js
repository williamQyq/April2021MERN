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
const { py_process, py_clock_cycle,  py_bb_process} = require('./script_packages/py_process');

//Connect to Mongo
mongoose.connect(dbURI, { 
        useUnifiedTopology: true, 
        useNewUrlParser: true,
        useCreateIndex: true
    })                //build mongoose connection
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/api/bb_items', require('./routes/api/bb_items'));
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
    const bbProductListings = db.collection(keys.Collections.BBItemListings);
    const productPriceListings = db.collection(keys.Collections.ProductsPriceListings);
    
    const changeStream = productPriceListings.watch();
    const BBChangeStream = bbProductListings.watch();

    BBChangeStream.on('change', (change) => {
        const doc = change.fullDocument;
        
        if(change.operationType === 'insert' || change.operationType === 'update') {
            io.sockets.emit(`server:changestream_bb`, doc);
            
        }

    })

    // py_bb_process();
    // py_clock_cycle();           // cycling item list push update tracked price
    changeStream.on('change', (change) => {
        const doc = change.fullDocument;

        if (change.operationType === 'insert') {
    
            //socket.emit
            io.sockets.emit(`server:changestream`, doc._id);
            py_process(doc._id,doc.link);
                                                                
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

