const { amazonSellingPartner } = require('../RateLimiter');

class ProdPricing {

    constructor() {
        this.config = {
            operation: "getPricing",
            endpoint: "productPricing",
            query: {
                MarketPlaceId: "",
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
        
        const createProdPricingTask = async () => {
            const SP = await amazonSellingPartner();
            try{
                let res = await SP.callAPI()
            } catch{

            }


        }

    }




}

module.exports = ProdPricing;