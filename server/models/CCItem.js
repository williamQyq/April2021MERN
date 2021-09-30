const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema for self tracking list 
const CCItemSchema = new Schema({
    link:{
        type: String,
        require:true
    },
    sku:{
        type: Number,
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
}, {collection: 'cc_item_listings'});

module.exports = CCItem = mongoose.model('cc_item', CCItemSchema);