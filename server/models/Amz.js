const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdentifierSchema = new Schema({
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
    identifiers: [IdentifierSchema],
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
    ProdPricing: mongoose.model('amzProdPricing', AmzProdPricingSchema),
    Identifier: mongoose.model('amzIdentifier', IdentifierSchema)
}