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
        offers: [{
            sellerSKU: {
                type: String,
            },
            buyingPrice: {
                listingPrice: {
                    currencyCode: {
                        type: String,
                        default: "USD"
                    },
                    amount: {
                        type: Number
                    }
                }
            },
            regularPrice: {
                currencyCode: {
                    type: String,
                    default: "USD"
                },
                amount: {
                    type: Number
                }
            },
            fulfillment: {
                type: String
            },
            itemCondition: {
                type: String
            }
        }]

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