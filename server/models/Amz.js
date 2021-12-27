const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema for self tracking list 
const AmzProdPricingSchema = new Schema({
    upc: {
        type: String,
        require: true
    },
    identifiers: [{
        asin: {
            type: String,
            require: true
        },
        offers: []

    }],
    modifyBy: {
        role: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
}, { collection: 'AmzProdPricing' });

module.exports = {
    ProdPricing: mongoose.model('amzProdPricing', AmzProdPricingSchema)
}