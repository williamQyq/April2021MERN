import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const IdentifierSchema = new Schema({

    asin: {
        type: String,
        require: true
    },
    offers: []
}, { _id: false })

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

export const AmzProdPricing = mongoose.model('AmzProdPricing', AmzProdPricingSchema);
export const AmzIdentifier = mongoose.model('AmzIdentifier', IdentifierSchema);