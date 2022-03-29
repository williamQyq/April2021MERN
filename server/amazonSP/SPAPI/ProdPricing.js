import { amazonSellingPartner } from '../RateLimiter.js';

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
        this.reqJSON = {
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

    // create upc asins prodpricing task
    createTasks(prod) {
        let queue = [];

        const taskPromise = async (upc, asins) => {
            let param = { ...this.reqJSON };
            param.query.Asins = asins;
            // if (asins.length > 1) param .ASIN: string
                try {
                    let sp = amazonSellingPartner();
                    let sellingPartnerResponse = await sp.callAPI(param)
                    return { upc, sellingPartnerResponse, limit: ProdPricing.limit }
                } catch (e) {
                    console.log("err=", e)
                }
        }

        let upcAsinsMap = this.#createProdAsinsMapping(prod);
        for (let [upc, asins] of upcAsinsMap) {
            if (!asins) {
                console.log(`======${upc}==\n ${asins}`)
            }
            queue.push(taskPromise(upc, asins))
        }

        return queue;
    }

}