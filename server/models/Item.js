const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ItemSchema = new Schema({
    link:{
        type: String,
        require:true
    },
    name:{
        type: String,
        require: true
    },
    price_timestamps:[{
        price:{
            type: Number,
        },
        date:{
            type: Date,
            default: Date.now
        }
    }],
    created_date:{
        type: Date,
        default: Date.now
    }
}, {collection: 'product_price_listings'});

module.exports = Item = mongoose.model('item', ItemSchema);