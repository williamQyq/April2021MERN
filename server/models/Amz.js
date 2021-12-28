const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const identifierSchema = new Schema({
    asin: {
        type: String,
        require: true
    },
    offers: []
})

//Create Schema for self tracking list 
const AmzProdPricingSchema = new Schema({
    upc: {
        type: String,
        require: true
    },
    identifiers: [identifierSchema],
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