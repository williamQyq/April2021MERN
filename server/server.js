const express = require('express');
const mongoose = require('mongoose');

const items = require('./routes/api/items');
//DB Config
const db = require('./config/keys').mongoURI;

//Bodyparser Middleware
const app = express();
app.use(express.json());


//Connect to Mongo
mongoose.connect(db, {useUnifiedTopology:true, useNewUrlParser: true})
    .then(()=> console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/api/items',items);

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server started on port ${port}`));
