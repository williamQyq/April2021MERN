import mongoose, { Document } from "mongoose";
import {
    AmzIdentifier,
    AmzProdPricing,
    AmzProdPricingDoc
} from "lib/models/Amazon.model";

export class AmazonSellingPartnerDataProcessor {
    protected _AmzProdPricing: mongoose.Model<AmzProdPricingDoc>;
    protected _AmzIdentifier: mongoose.Model<Document> | typeof AmzIdentifier;
    constructor() {
        this._AmzProdPricing = AmzProdPricing;
        this._AmzIdentifier = AmzIdentifier;
    }

    /**
     * @description Get all amazon seller central listings pricing details
     * @returns mongoose.Document
     */
    async findAllProdPricing() {
        const query: mongoose.QueryOptions<AmzProdPricingDoc> = {
            upc: { $exists: true },
            identifiers: { $exists: true }
        }
        let productPricingData = await this._AmzProdPricing.find(query).exec();
        return productPricingData;
    }

    async findProdPricingOnUpc(upc: string) {
        return this._AmzProdPricing.find({ upc }).exec();
    }

    async updateProdPricingOffer(upc: string, asin: string, offers: any[]) {
        const filter = { "upc": upc, "identifiers.asin": asin }
        const update = { $set: { "identifiers.$.offers": offers } }
        const option = { useFindAndModify: false }
        await this._AmzProdPricing.findOneAndUpdate(filter, update, option).exec();
    }

    async upsertProdPricingNewAsin(upc: string, asin: string) {
        let newIdentifier = new AmzIdentifier({ asin })
        let newProd = new AmzProdPricing({ upc, identifiers: new Array() })

        let query = { "upc": upc }
        let update = { $setOnInsert: { newProd } }
        let option = { upsert: true, new: true, useFindAndModify: false };
        return AmzProdPricing.updateOne(query, update, option)  //set on insert for new upc
            .then(() => {
                let query = { "upc": upc }
                let update = { $pull: { "identifiers": { "asin": asin } } }
                return AmzProdPricing.updateOne(query, update)
            })
            .then(() => {
                let query = { "upc": upc }
                let update = { $push: { identifiers: newIdentifier } }
                return AmzProdPricing.updateOne(query, update)
            })

    }

}