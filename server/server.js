const express = require('express');
const mongoose = require('mongoose');

const items = require('./routes/api/items');
//DB Config
const dbURI = require('./config/keys').mongoURI;
const keys = require('./config/keys');


//Bodyparser Middleware
const app = express();
app.use(express.json());


//Connect to Mongo
mongoose.connect(dbURI, {useUnifiedTopology:true, useNewUrlParser: true})
    .then(()=> console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/api/items',items);

const port = process.env.PORT || 5000;

const db = mongoose.connection;
db.once('open',() =>{
    app.listen(port, ()=> {
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

