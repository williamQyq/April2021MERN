const { resolveModuleName } = require('typescript');
const { amazonSellingPartner } = require('../RateLimiter');

class ProdPricing {

    constructor() {
        this.config = {
            operation: "getPricing",
            endpoint: "productPricing",
            query: {
                MarketPlaceId: "ATVPDKIKX0DER",
                Asins: undefined,
                ItemType: "Asin"
            }
        }
    }

    //@desc: create a mapping between upc and its asins.
    //@return: a Map of upc and asins
    createProdAsinsMapping(prodList) {
        const upcAsinsMap = new Map();
        prodList.forEach(prod => {
            let asins = prod.identifiers.map(identifier => (identifier.asin));
            upcAsinsMap.set(prod.upc, asins);
        });

        return upcAsinsMap;
    }

    // create upc asins prodpricing task
    createTask(upc, asins) {

        const doProdPricingTask = async (resolve, reject) => {
            let taskConfig = { ...this.config };  //make a copy of config
            taskConfig.query.Asins = asins;

            const SP = await amazonSellingPartner();
            try {
                let res = await SP.callAPI(taskConfig)
                resolve({ upc, prom: res })
            } catch (e) {
                console.error(`AWS SP API ERROR:\n${e}`)
                reject(`AWS SP API ERROR:\n${e}`)
            }
        }

        return new Promise((resolve, reject) => {
            doProdPricingTask(resolve, reject)
        })

    }




}

module.exports = ProdPricing;