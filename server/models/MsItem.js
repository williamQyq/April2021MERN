const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema for self tracking list 
const MSItemSchema = new Schema({
    link: {
        type: String,
        require: true
    },
    sku: {
        type: String,
        require: true
    },
    upc: {
        type: String,
    },
    qty: {
        type: Number
    },
    name: {
        type: String,
        require: true
    },
    price_timestamps: [{
        price: {
            type: Number,
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    created_date: {
        type: Date,
        default: Date.now
    }
}, { collection: 'msStoreListings' });

module.exports = mongoose.models.MSItem || mongoose.model('MSItem', MSItemSchema);