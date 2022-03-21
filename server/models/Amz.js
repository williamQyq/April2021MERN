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
}, { collection: 'amzProdPricing' });


module.exports = {
    AmzProdPricing: mongoose.model('AmzProdPricing', AmzProdPricingSchema),
    AmzIdentifier: mongoose.model('AmzIdentifier', IdentifierSchema)
}