const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ItemSchema = new Schema({
    name:{
        type: String,
        require: true
    },
    price:{
        type: Number,
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    }
}, {collection: 'product_price_listings'});

module.exports = Item = mongoose.model('item', ItemSchema);