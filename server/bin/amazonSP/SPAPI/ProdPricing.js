import { sellingPartner } from '../RateLimiter.js';
const PRODUCT_PRICING = "PROD_PRICING";
const RATE_PER_SEC = 10;
const ASINS_LIMIT = 20;

export default class ProdPricing {

    static limit = {
        ratePerSec: RATE_PER_SEC,
        asinsLimit: ASINS_LIMIT,
        type: PRODUCT_PRICING
    };

    constructor() {
        this.getPricingParam = {
            operation: "getPricing",
            endpoint: "productPricing",
            query: {
                MarketplaceId: "ATVPDKIKX0DER",
                Asins: undefined,
                ItemType: "Asin"
            }
        }
    }

    /* 
    @private
    @desc: create a mapping between upc and its asins.
    @param:
    @return: a Map of upc and asins 
    */
    #createProdAsinsMapping(prod) {
        let upcAsinsMap = new Map();

        let asins = prod.identifiers.map(identifier => identifier.asin);  //get all asins
        let asinsChunks = this.#sliceAsinsOnLimit(asins);  //divide asins to chuncks on asins number limit
        //add to Map for each asins chunk.
        asinsChunks.forEach(asinsChunk => {
            upcAsinsMap.set(prod.upc, asinsChunk);
        })

        return upcAsinsMap;
    }

    #sliceAsinsOnLimit(asinsArray) {
        let chuncks = [];
        let limit = ProdPricing.limit.asinsLimit;

        for (let i = 0; i < limit; i += limit) {
            chuncks.push(asinsArray.slice(i, i + limit));
        }
        return chuncks;
    }

    // create upc asins prodpricing task and push to bucket
    createAndAddTasksToBucket(bucket,prod) {
        let upcAsinsMap = this.#createProdAsinsMapping(prod);
        for (const [upc, asins] of upcAsinsMap) {
            bucket.addTask(()=>this.#taskPromise(upc, asins))
        }

    }

    #taskPromise(upc, asins) {
        return new Promise((resolve, reject) => {
            let sp = sellingPartner();
            let param = { ...this.getPricingParam, query: { ...this.getPricingParam.query } };  //make deep copy of apiParam
            param.query.Asins = asins;
            sp.callAPI(param)
                .then(sellingPartnerResponse => {
                    let taskResult = {
                        upc,
                        sellingPartnerResponse,
                        limit: ProdPricing.limit
                    }
                    resolve(taskResult)
                })
                .catch(e => {
                    console.error(`***[ERR] ProductPricing task - upc:${upc}, asins:${asins}\n msg:${e}\n\n`)
                    reject(e)
                })
        })
    }

}