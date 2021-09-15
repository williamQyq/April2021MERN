const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema for self tracking list 
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
}, {collection: 'bb_item_listings'});

module.exports = BBItem = mongoose.model('bb_item', ItemSchema);