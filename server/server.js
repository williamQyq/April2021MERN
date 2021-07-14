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

//socket io server listen port 3000 same as client
const httpServer = require('http').createServer(app);
const io = require("socket.io")(httpServer);


io.on("connection", (socket) => {
    console.log('a user connected');
});

//Connect to Mongo
mongoose.connect(dbURI, {useUnifiedTopology:true, useNewUrlParser: true})
    .then(()=> console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/api/items',items);

// console.log(`dirname=${__dirname}`)

// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static('../mern-project/build'));

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, '/../mern-project', 'build', 'index.html'));
//     });
// }

const port = process.env.PORT || 5000;

const db = mongoose.connection;
db.once('open',() =>{
    httpServer.listen(port, ()=> {
        console.log(`Server started on port ${port}`);
    });

    const productPriceListings = db.collection(keys.Collections.ProductsPriceListings);
    const changeStream = productPriceListings.watch();
    
    changeStream.on('change',(change)=>{
        console.log(change);

        if(change.operationType === 'insert') {
            const listing = change.fullDocument;

        }
    })

});

