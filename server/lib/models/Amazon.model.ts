import mongoose, { Document } from 'mongoose';
const Schema = mongoose.Schema;

export interface AmzProdPricingDoc extends mongoose.Document {
    upc: string;
    identifiers: Identifier[];
    modifyBy: {
        role: string;
        date: Date;
    };
}

export interface Identifier extends Document {
    asin: string;
    offers: any[];
}

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

export const AmzProdPricing = mongoose.model<AmzProdPricingDoc>('AmzProdPricing', AmzProdPricingSchema);
export const AmzIdentifier = mongoose.model<Identifier>('AmzIdentifier', IdentifierSchema);